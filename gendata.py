import csv
import random
from faker import Faker

fake = Faker()
num_tickets = 10000
statuses = ["To Do", "In Progress", "Blocked", "Done"]

with open("tickets.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Ticket ID", "Title", "Description", "Status"])

    for i in range(1, num_tickets + 1):
        ticket_id = f"TICKET-{i:05d}"
        title = fake.sentence(nb_words=5)
        description = fake.paragraph(nb_sentences=3)
        status = random.choice(statuses)

        writer.writerow([ticket_id, title, description, status])

print("done")
