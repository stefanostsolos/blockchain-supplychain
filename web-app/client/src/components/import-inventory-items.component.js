import React, { Component } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ImportInventoryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      isHovered: false,
    };
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  onClickHandler = async () => {
      const headers = {
        "x-access-token": sessionStorage.getItem("jwtToken"),
      };
      const data = new FormData();
      data.append('file', this.state.selectedFile);
      data.append('id', sessionStorage.getItem("userId"));
      try {
        toast.info("Uploading products...", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false
        });
        console.log('upload 1');
        const response = await axios.post('http://localhost:8090/product/upload', data, { headers: headers });
        console.log('upload 2');
        if (response.data.message === "Success") {
          console.log("upload success");
          toast.dismiss();
          toast.success("Inventory Items imported successfully!", {
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
                window.location = "/products";
            }
        });
        }
      } catch (error) {
        console.error('Error during upload:', error);
      }
  };

  render() {
    return (
      <div>
        <input type="file" name="file" accept=".json" style={{ 
        borderRadius: '20px',
        backgroundColor: this.state.isHovered ? '#333' : '#0A0A0A',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
        onChange={this.onChangeHandler} />
        <button type="button" style={{ 
        borderRadius: '20px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        padding: '10px 10px',
        }} onClick={this.onClickHandler}>Upload</button>
        <ToastContainer autoClose={2000} theme="dark" />  
      </div>
    );
  }
}

export default ImportInventoryItems;