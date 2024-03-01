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
        self.common_path = '/src/app/api/form/python/'
        self.name = sys.argv[1]
        self.image_path = f'{os.getcwd()}{self.common_path}certificate.png'
        self.font_path = f'{os.getcwd()}{self.common_path}font.ttf'
        self.font1_path = f'{os.getcwd()}{self.common_path}font1.ttf'
        self.event_name = sys.argv[3]
        self.event_font = f'{os.getcwd()}{self.common_path}font3.ttf'
        self.image_output = f'{os.getcwd()}{self.common_path}1.pdf'
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
            password = sys.argv[5]
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