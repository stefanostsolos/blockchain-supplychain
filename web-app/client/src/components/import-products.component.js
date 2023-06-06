import React, { Component } from 'react';
import axios from 'axios';

class ImportProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
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
      console.log('upload 1');
      const response = await axios.post('http://localhost:8090/product/upload', data, { headers: headers });
      console.log('upload 2');
      if (response.data.success) {
        console.log("upload success");
        /*
        const products = JSON.parse(response.data.fileContent);
        for (const item of products) {
          const product = {
            name: item['PRODUCT_ID'],
            id: sessionStorage.getItem("userId"),
            price: String(item['UNIT_COST']),
          };
          try {
            await axios.post("http://localhost:8090/product", product, { headers: headers });
          } catch (error) {
            console.error('Error while creating a product:', error);
          }
        } */
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
      </div>
    );
  }
}

export default ImportProducts;
