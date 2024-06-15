import os

# Define the directories to search
directories = ['server', 'src']

# Define the output file
output_file = 'code.txt'

def find_files_with_extension(root_dir):
    files_with_extension = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            if '.' in file:  # Check if the file has an extension
                relative_path = os.path.relpath(os.path.join(root, file), root_dir)
                files_with_extension.append(os.path.join(root, file))
    return files_with_extension

def main():
    all_files = []
    for directory in directories:
        if os.path.exists(directory):
            files = find_files_with_extension(directory)
            all_files.extend(files)

    with open(output_file, 'w') as f:
        for file in all_files:
            with open(file, 'r') as file_content:
                content = file_content.read()
                f.write(f'## {file}\n')
                f.write(f'{{{{\n{content}\n}}}}\n\n')

if __name__ == '__main__':
    main()
