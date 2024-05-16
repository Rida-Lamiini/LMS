import React, { useState } from 'react';

export const UploadAttachments = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleChange = (e) => {
        setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    };

    const handleUpload = () => {
        // Here you can implement the upload function to send files to the server and save them in a folder
        console.log(selectedFiles);
        // Example: You can use FormData to send files to the server
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        // Send formData to the server using fetch or axios
        // fetch('/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
    };

    console.log(selectedFiles)

    return (
        <div>
            <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="multiple_files"
                type="file"
                multiple
                onChange={handleChange}
            />
            <button onClick={handleUpload}>Upload</button>
            
            <div>
                {selectedFiles.map((file, index) => (
                    <div key={index}>
                        <p>{file.name}</p>
                        {/* <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '100px' }} /> */}
                    </div>
                ))}
            </div>
        </div>
    );
};
