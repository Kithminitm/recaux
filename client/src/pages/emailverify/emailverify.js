import React, { Component } from "react";
import axios from "axios";
const jwt = require('jsonwebtoken')

class emailverify extends Component {
  state = {
    sucsess: false,
    exp:false
  };

  componentDidMount() {
    console.log('token - '+this.props.match.params.id);

    try {
      const iid = jwt.verify(this.props.match.params.id,'authdemo')
      console.log(iid)
      axios
      .post(
        "/usr/confirmemail/" + iid.id
      )
      .then(res => {
        this.setState({ sucsess: true });
        console.log(res);
      })
      .catch(err => {
        this.setState({ sucsess: false });
        console.log(err);
      });

    } catch (error) {

      this.setState({ exp: true });
        console.log(error);
      
    }


   

    
  }

  render() {
    if (!this.state.sucsess) {
      return (
        <div class="alert alert-dark" role="alert">
  please wait 
</div>
      );
    }
    if (this.state.exp) {
      return (
        <div class="alert alert-dark" role="alert">
  token expired , please try again
</div>
      );
    }
    
    else {
      return (<div class="alert alert-success" role="alert">
      email confirmed
    </div>)
    }
  }
}

export default emailverify;
