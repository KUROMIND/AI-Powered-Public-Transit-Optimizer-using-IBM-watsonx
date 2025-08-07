import pandas as pd

# List of GTFS files to explore
gtfs_files = ['stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt']

for file in gtfs_files:
    try:
        print(f"\n===== {file.upper()} =====")
        df = pd.read_csv(file)
        print(df.head())
        print(f"Columns: {', '.join(df.columns)}")
        print(f"Total rows: {len(df)}")
    except FileNotFoundError:
        print(f"File {file} not found in the current directory.")
