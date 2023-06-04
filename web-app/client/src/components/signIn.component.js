import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class SignIn extends Component {
  constructor(props) {
    super(props);

    this.onChangeUserType = this.onChangeUserType.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      userType: "producer",
      name: "",
      password: "",
      role: "producer",
    };
  }

  onChangeUserType(e) {
    if (e.target.value === "admin") {
      this.setState({
        role: "admin",
      });
    } else if (e.target.value === "producer") {
      this.setState({
        role: "producer",
      });
    } else if (e.target.value === "manufacturer") {
      this.setState({
        role: "manufacturer",
      });
    } else if (e.target.value === "distributor") {
      this.setState({
        role: "distributor",
      });
    } else if (e.target.value === "retailer") {
      this.setState({
        role: "retailer",
      });
    }else if (e.target.value === "consumer") {
      this.setState({
        role: "consumer",
      });
    }
    this.setState({
      userType: e.target.value,
    });
    console.log(this.state.userType);
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const signIn = {
      id: this.state.name,
      password: this.state.password,
    };

    console.log(signIn);

    axios
      .post("http://localhost:8090/user/signin/" + this.state.role, signIn)
      .then((res) => {
        console.log(res.data.data.accessToken);
        console.log(res.data.data);
        sessionStorage.setItem("jwtToken", res.data.data.accessToken);
        sessionStorage.setItem("role", this.state.role);
        sessionStorage.setItem("usertype", this.state.userType);
        sessionStorage.setItem("userId", res.data.data.id);
        //sessionStorage.setItem('userId', user.producerId || user.manufacturerId || user.distributorId || user.retailerId || user.consumerId);

        if (this.state.usertype === "admin") {
          window.location = "/users"
        }
        else {
          window.location = "/products"
        }
      })
      .catch((error) => {
          console.log(error);
          toast.error("Incorrect credentials, please try again.", {
            position: toast.POSITION.TOP_CENTER
        });
      });
  }

  render() {
    return (
      <div>
      <div style={{textAlign: "center"}}>
        <h3><strong>Welcome to SupplyChain!</strong></h3>
        <h3>Sign In</h3>
        </div>
        <br />
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Usertype: </label>
            <select
              ref="usertypeInput"
              required
              className="form-control"
              value={this.state.userType}
              onChange={this.onChangeUserType}
            >
              <option key="producer" value="producer">
                Producer
              </option>
              <option key="manufacturer" value="manufacturer">
                Manufacturer
              </option>
              <option key="distributor" value="distributor">
                Distributor
              </option>
              <option key="retailer" value="retailer">
                Retailer
              </option>
              <option key="consumer" value="consumer">
                Consumer
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>UserID: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              required
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Sign In" className="btn btn-primary" />
          </div>
        </form>
        <ToastContainer autoClose={2000} theme="dark" />
      </div>
    );
  }
}

export default SignIn;