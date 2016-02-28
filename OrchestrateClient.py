import porc
import csv

client = porc.Client('767da773-3cc8-4816-9dac-d811fb6767d5')

def read_csv_file(file_name):
    with open(file_name) as csvfile:
        csv_data_reader = csv.DictReader(csvfile)

response = client.put(read_csv_file('CityLight.csv'))
response.raise_for_status()
