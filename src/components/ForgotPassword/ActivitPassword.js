import React, { Component } from 'react';
import axios from 'axios'
import './style.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


class ActivitPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            password: '',
            token: ''
         }

         this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange =input => (event)=>{
        event.preventDefault()
        this.setState({[input]: event.target.value})
    }
    componentDidMount(){
       let token = this.props.match.params.token
       let splitToken = token.split('/')
       this.setState({token: splitToken})
        
    }
   
   
    onSubmit = (event)=>{
        event.preventDefault()
        const saveLinkPassword = {
            password: this.state
        }
        event.preventDefault()
        axios.post(`http://localhost:8000/user/activtypassword/${this.state}`, saveLinkPassword).then(res => res.json()).then(res => {toast.success("Password Update") }).catch(err => {toast.error(err.response.data)})
    }
    render() { 
        return ( 
            <div className='passwordForgot'>
                <ToastContainer />
                <h1>ENTER NEW  PASSWORD</h1>
                <div className='recoverInput'>
                    <label>PASSWORD: </label>
                    <input placeholder='password' name="password"  onChange={this.handleChange("password")}/>
                </div>
                
                <button className='btn btn-success' onClick={this.onSubmit}>Save Password</button>
            </div>
         );
    }
}
 
export default ActivitPassword;