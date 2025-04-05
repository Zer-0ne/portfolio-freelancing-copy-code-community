import { Data, EventsInterface, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import { google, sheets_v4 } from 'googleapis';
import { GaxiosResponse } from "gaxios";
import Event from "@/Models/Event";
import { monthName } from "@/utils/constant";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Certificate from "@/Models/certificate";
import User from "@/Models/Users";

// Connect to MongoDB (ensure this runs globally in your app)
mongoose.connect(process.env.MONGODB_URI as string);

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Certificate generation class
class HandleCertificate {
    name: string;
    title: string;
    email: string;
    constructor(name: string, title: string, email: string) {
        this.name = name;
        this.title = title;
        this.email = email;
    }
    generate = async (id: number) => {
        try {
            const data = {
                name: this.name,
                id: `${id}`,
                title: this.title,
                email: this.email,
                password: process.env.EMAIL_PASS,
                date: `${monthName[new Date().getMonth()]} ${new Date().getDate()}, ${new Date().getFullYear()}`
            };
            const response = await fetch(`${process.env.FLASK_URL}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...data })
            });
            const res = await response.json();
            return res.status;
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ message: error.message, status: 500 }, { status: 500 });
        }
    }
}

// POST handler
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 });

        const {
            functionality,
            fields,
            sequence,
            title,
            sheetId,
        } = await request.json();

        // console.log(fields);

        function joinArrays(data: Data) {
            const result: Data = {};
            for (const key in data) {
                if (Array.isArray(data[key])) {
                    result[key] = data[key].join(' ');
                } else {
                    result[key] = data[key];
                }
            }
            return result;
        }

        async function checkRequiredFields(sequence: Data[], fields: Data) {
            if (sequence) {
                for (const field of sequence) {
                    if (field.required && !fields[field.name as string]) {
                        return field.name;
                    }
                }
            }
        }

        const missingField = await checkRequiredFields(sequence, fields);
        if (missingField) {
            return NextResponse.json({ message: `The field "${missingField}" is required. Please provide a value for it.`, status: 'error' }, { status: 401 });
        }

        const orderedData: Data = {};
        sequence?.forEach((field: Data) => {
            orderedData[field?.name as string] = fields[field.name as string];
        });
        Object.keys(fields).forEach(key => delete fields[key]);
        Object.assign(fields, orderedData);

        const auth = await google.auth.getClient({
            credentials: {
                type: "service_account",
                private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_SHEET_CLIENT_ID,
                token_url: "https://oauth2.googleapis.com/token",
                universe_domain: "googleapis.com",
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: "v4", auth });
        let values = [
            [session.user.email, ...Object.values(joinArrays(fields)) as string[]],
        ];

        let certificateId: string | null = null;

        if (fields['certificate']) {


            // Execute certificate creation and email sending if selectedTemplate exists
            if (fields['selectedTemplate']) {
                const user = await User.findOne({ email: session.user.email })
                if (!user) return NextResponse.json({ message: 'User not found', status: 'error' }, { status: 404 });

                const newCertificate = new Certificate({
                    date: new Date(),
                    user: user._id,
                    eventName: fields['certificate'],
                    template: fields['selectedTemplate'],
                    category: "participate",
                    name: fields?.Name!
                });
                await newCertificate.save();
                certificateId = newCertificate._id.toString();
                await User.findByIdAndUpdate(
                    user?._id,
                    { $push: { certificate: newCertificate._id } },
                    { new: true }
                );

                const certificateLink = `${process.env.BASE_URL}/certificate/${certificateId}`;
                const mailOptions = {
                    from: `"CopyCode" <${process.env.EMAIL_USER}>`,
                    to: session.user.email,
                    subject: `🎉 Your Certificate for ${fields['certificate']} is Ready!`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Certificate Confirmation</title>
                        </head>
                        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center;">
                                        <img src="https://ci3.googleusercontent.com/meips/ADKq_NZJt9APeJJDGPkmusVPH80MJ9jfTAj1tOgZ-71HwfoqpOi-RPXX3kHtm1-tWETop3qmQMLS_v-gaXVvAjeGWRgTrt2jyAbwmemQoKsjTOVem2bdH_R5=s0-d-e1-ft#https://drive.google.com/uc?id=1U9U0GbgAcUt0AGVgcsp5bdljUfXTwE5H/view?usp=sharing" alt="CopyCode Logo" style="width: 220px; height: auto; margin-bottom: 15px;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Certificate Achievement</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td>
                                                    <h2 style="margin: 0 0 20px; color: #374151; font-size: 24px; text-align: center;">Congratulations, ${fields['Name']}! 🎓</h2>
                                                    
                                                    <p style="margin: 0 0 20px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                                        We're excited to inform you that your certificate for <strong style="color: #6366F1;">${fields['certificate']}</strong> is now ready! 
                                                    </p>
                                                    
                                                    <p style="margin: 0 0 30px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                                        Your hard work and dedication have paid off. This certificate recognizes your achievement and is a testament to your skills and knowledge.
                                                    </p>
                                                    
                                                    <!-- Certificate Preview Box -->
                                                    <div style="background-color: #F3F4F6; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center; border-left: 5px solid #6366F1;">
                                                        <p style="margin: 0 0 15px; color: #4B5563; font-size: 16px;">Your certificate is just one click away:</p>
                                                        <a href="${certificateLink}" style="display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);">View Certificate</a>
                                                    </div>
                                                    
                                                    <!-- Social Sharing -->
                                                    <p style="margin: 0 0 20px; color: #4B5563; font-size: 16px; text-align: center;">
                                                        Share your achievement with your network:
                                                    </p>
                                                    <div style="text-align: center; margin-bottom: 30px;">
                                                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateLink)}" style="display: inline-block; margin: 0 5px; text-decoration: none;">
                                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 32px; height: 32px;">
                                                        </a>
                                                        <a href="https://twitter.com/intent/tweet?text=I just earned my ${encodeURIComponent(fields['certificate'])} certificate from CopyCode!&url=${encodeURIComponent(certificateLink)}" style="display: inline-block; margin: 0 5px; text-decoration: none;">
                                                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 32px; height: 32px;">
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #F3F4F6; padding: 30px 20px; text-align: center;">
                                        <p style="margin: 0 0 15px; color: #6B7280; font-size: 14px;">
                                            Thank you for being part of our community. We look forward to seeing what you'll achieve next!
                                        </p>
                                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                                            <strong>The CopyCode Team</strong>
                                        </p>
                                        <p style="margin: 10px 0 0; color: #6B7280; font-size: 14px;">
                                            <a href="https://copycode.vercel.app" style="color: #6366F1; text-decoration: none;">copycode.vercel.app</a>
                                        </p>
                                        <div style="margin-top: 20px;">
                                            <a href="https://copycode.vercel.app/about" style="color: #6B7280; text-decoration: none; font-size: 13px; margin: 0 10px;">Community</a>
                                            <a href="https://copycode.vercel.app/events" style="color: #6B7280; text-decoration: none; font-size: 13px; margin: 0 10px;">Events</a>
                                            <a href="https://copycode.vercel.app/contact" style="color: #6B7280; text-decoration: none; font-size: 13px; margin: 0 10px;">Contact</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Small print -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                                <tr>
                                    <td style="padding: 20px; text-align: center; color: #9CA3AF; font-size: 12px;">
                                        © ${new Date().getFullYear()} CopyCode. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `,
                };
                await transporter.sendMail(mailOptions);
            } else {
                const today = new Date();
                const todayEvents = (await Event?.find({}))?.filter((event: EventsInterface) => {
                    const eventDate = new Date(event.eventDate);
                    return (
                        eventDate.getDate() === today.getDate() &&
                        eventDate.getMonth() === today.getMonth() &&
                        eventDate.getFullYear() === today.getFullYear()
                    );
                }).map(({ title }: { title: string }) => title);

                if (!todayEvents.includes(fields['certificate'] as string)) {
                    return NextResponse.json({ message: 'There is no active event', status: 'error' }, { status: 400 });
                }

                const id = Date.now();
                const certificates = new HandleCertificate(fields['Name'] as string, fields['certificate'] as string, session.user.email);
                const res = await certificates.generate(id);
                values[0] = [`${id}`].concat(values[0]);

                if (res !== '200') {
                    return NextResponse.json({ message: 'Something went wrong', error: res.error, status: 'error' }, { status: 500 });
                }
            }
        }

        const option: {
            create: GaxiosResponse<sheets_v4.Schema$Spreadsheet>,
            update: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse>
        } = {
            create: await sheets.spreadsheets.create({
                requestBody: {
                    properties: { title },
                },
            }),
            update: sheetId && await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'A2:Z2',
                valueInputOption: "USER_ENTERED",
                requestBody: { values }
            })
        };

        const result = (functionality in option) && await option[functionality as keyof typeof option].data;
        return NextResponse.json({
            message: fields['selectedTemplate'] ? 'Created successfully' : 'Created successfully',
            data: result,
            certificateId: certificateId || undefined,
            status: 'success'
        });
    } catch (err: { message: string } | any) {
        console.log(err);
        return NextResponse.json({ error: err.message, status: 'error' }, { status: 500 });
    }
};