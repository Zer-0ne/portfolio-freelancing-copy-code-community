import { Data, EventsInterface, Session } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { NextRequest, NextResponse } from "next/server";
import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from "gaxios";
import path from 'path'
import Event from "@/Models/Event";
import { exec } from 'child_process';



const pythonScript = `
#!/bin/bash 
import sys
import os
import subprocess

# Check if Pillow is installed
try:
    from PIL import Image,ImageDraw,ImageFont
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.mime.base import MIMEBase
    from email import encoders
except ImportError:
    print("Pillow is not installed. Installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow secure-smtplib email"])


class  ImageProcessor:
    def __init__(self):
        self.name = sys.argv[1].replace('-',' ')
        self.image_path = f'python/certificate.png'
        self.font_path = f'python/font.ttf'
        self.font1_path = f'python/font1.ttf'
        self.event_name = sys.argv[3]
        self.event_font = f'python/font3.ttf'
        self.image_output = f'python/1.pdf'
        self.id = sys.argv[2]
        self.img = Image.open(self.image_path)
        
    def  processImage(self):
        try:
            # Create a drawing object
            draw = ImageDraw.Draw(self.img)


            # size of image
            width, height = self.img.size


            # Load font for text writing
            font = ImageFont.truetype(self.font_path, 100)
            id_font = ImageFont.truetype(self.font1_path,30)
            event_font = ImageFont.truetype(self.event_font,47)

            # Draw rectangle around the image with dimensions
            name_width = draw.textlength(self.name, font=font)
            id_width = draw.textlength(self.id, font=id_font)
            event_width = draw.textlength(self.event_name,font=event_font)

            # for name
            draw.text(((width // 2 - name_width // 2)-600, (height // 2)-30),
                    self.name,
                    font=font,
                    fill='black',
                    align='center')
            
            # for id 
            draw.text(
                (width-id_width-210, 180),
                f'ID: {self.id}',
                font=id_font,
                fill='grey',
                align='center'),
            
            # for event name 
            draw.text(
                (width-event_width-140, 115),
                f'{self.event_name}',
                font=event_font,
                fill='#004b23',
                align='center'),
            self.img.save(self.image_output,format='PDF')
        except:
            print('somthing went wrong')
            raise Exception('Could not open the image')
    def sendMail(self):
        try:
            # Set your email credentials and details
            sender_email = "copycodecommunity@gmail.com"
            receiver_email = sys.argv[4]
            password = sys.argv[5].replace('-',' ')
            subject = self.event_name

            # Create the MIME object
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] =  receiver_email
            message["Subject"] = subject
            
            # body 
            body = f'''
                hi
            '''

            # Establish a connection with the SMTP server
            server = smtplib.SMTP("smtp.gmail.com", 587)
            # Start TLS for security
            server.starttls()
            # Login to your email account
            server.login(sender_email, password)

            message.attach(MIMEText(body, "html"))
            attachment = open(self.image_output, "rb")
            pdf_attachment = MIMEBase("application", "octet-stream")
            pdf_attachment.set_payload(attachment.read())
            encoders.encode_base64(pdf_attachment)
            pdf_attachment.add_header("Content-Disposition", f"attachment; filename=certificate.pdf")
            message.attach(pdf_attachment)
            server.sendmail(sender_email, receiver_email, message.as_string())
            server.quit()
            print('Thank you for interest! Check your mailbox.')
        except:
            print('somthing went wrong')
            raise Exception('Could not open the image')


        
if  __name__ == '__main__':
    processor = ImageProcessor()
    processor.processImage()
    processor.sendMail()
`



// create certificate and send to the image of user
class HandleCertificate {
    name: string;
    title: string;
    email: string
    constructor(name: string, title: string, email: string) {
        this.name = name;
        this.title = title;
        this.email = email
    }
    generate = async (id: number) => {
        try {
            const fs = await import('fs')
            fs.writeFileSync('script.py', pythonScript);
            const args = [this.name.replace(' ', '-'), `${id}`, this.title, this.email, process.env.EMAIL_PASS]

            // Combine the script path and arguments into a single command
            const command = await `python ${pythonScript} ${args.join(' ')}`;

            await exec(command, (error: Error | null, stdout: string, stderr: string) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }
                if(stderr){
                    console.error(`Error: ${error}`);
                    return;
                    
                }

                // Process the output if needed
                console.log(`Output: ${stdout}`);
                return
            });
        } catch (error: any) {
            return NextResponse.json({ message: error.message, status: 500 }, { status: 500 })
        }
    }
}


// create post
export const POST = async (request: NextRequest) => {
    try {
        const session = await currentSession() as Session;
        if (!session) return NextResponse.json({ message: 'Please login' }, { status: 401 })

        // request from the client 
        const {
            functionality,
            fields,
            title, // this is only for create a new sheet for name the title  of the sheet
            sheetId, // this is for update specific sheet
        } = await request.json();

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
        })

        const sheets = google.sheets({ version: "v4", auth });
        let values = [
            [
                session.user.email, ...Object.values(fields) as string[]
            ],
            // Additional rows ...
        ];
        if (fields['certificate']) {
            const today = new Date(); // This will get the current date

            const todayEvents = (await Event?.find({}))?.filter((event: EventsInterface) => {
                const eventDate = new Date(event.eventDate);
                return (
                    eventDate.getDate() === today.getDate() &&
                    eventDate.getMonth() === today.getMonth() &&
                    eventDate.getFullYear() === today.getFullYear()
                );
            })
                .map(({ title }: { title: string }) => title);
            if ([fields['certificate']].includes(todayEvents)) return NextResponse.json({ message: 'There is no active event', status: 'error' })
            const id = Date.now()
            const certificates = new HandleCertificate(fields['Name'], fields['certificate'], session.user.email);
            await certificates.generate(id)
            values[0] = [`${id}`].concat(values[0])
        }
        const option: {
            create: GaxiosResponse<sheets_v4.Schema$Spreadsheet>,
            update: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse>
        } = {
            create: await sheets.spreadsheets.create({
                requestBody: {
                    properties: {
                        title,
                    }
                },
                // auth: 
            }),
            update: sheetId && await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId && sheetId,
                range: 'A2:Z2',
                valueInputOption: "USER_ENTERED",
                requestBody: { values }
            })
        }


        const result = (functionality in option) && await option[functionality as keyof typeof option].data
        return NextResponse.json({ message: 'created secussfully', data: result, status: 'success' })
    } catch (err: {
        message: string
    } | any) {
        console.log(err)
        return NextResponse.json({ error: err.message, status: 'error' }, { status: 500 })
    }
}
