import sys
from google.appengine.api import mail

mail.send_mail(sender=sys.argv[1], to=sys.argv[2], subject=sys.argv[3], body=sys.argv[4])

try:
    mail.send_mail(sender=sys.argv[1], to=sys.argv[2], subject=sys.argv[3], body=sys.argv[4])
    print("Sending mail")
except:
    print("Something failed sending email")

sys.stdout.flush()
