import csv
import random
from faker import Faker

fake = Faker()
num_tickets = 10000
statuses = ["To Do", "In Progress", "Blocked", "Done"]

all_ids = [f"TICKET-{i:05d}" for i in range(0, 100000)]
if num_tickets > len(all_ids):
    raise ValueError("Number of tickets exceeds the number of unique IDs available.")
random_ids = random.sample(all_ids, num_tickets)

with open("tickets.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["ticketId", "title", "description", "status"])

    for ticket_id in random_ids:
        title = fake.sentence(nb_words=5)
        description = fake.paragraph(nb_sentences=3)
        status = random.choice(statuses)

        writer.writerow([ticket_id, title, description, status])

print("done")
