import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

export const FileUpload = ({onUploaded}) => {
  const onFileUploaded = (e, file) => {
    const data = JSON.parse(file.serverId);
    onUploaded(data);
  }

  return (
    <React.Fragment>
      <p>To get your stats export a CSV file of your ticks from <a href="https://www.problemator.fi">problemator.fi</a> and upload it here. It won't be saved anywhere.</p>
      <FilePond 
        onprocessfile={onFileUploaded}
        server={{ process: "./api/statistics/process" }}
      />
    </React.Fragment>
  );
}

export default FileUpload;