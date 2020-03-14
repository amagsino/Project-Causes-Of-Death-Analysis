import csv
import json
 
csvFilePath = 'death_natl.csv'
jsonFilePath = 'death_data.json'

def read_CSV(csvFilePath, jsonFilePath):
    csv_rows = []
    with open(csvFilePath) as csvfile:
        reader = csv.DictReader(csvfile)
        field = reader.fieldnames
        for row in reader:
            csv_rows.extend([{field[i]:row[field[i]] for i in range(len(field))}])
            convert_write_json(csv_rows, jsonFilePath)
 
#Convert csv data into json and format it to make it human readable
def convert_write_json(data, jsonFilePath):
    with open(jsonFilePath, "w") as f:
        f.write(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': ')))
 
 
read_CSV(csvFilePath, jsonFilePath)