import React, { Component } from 'react';
import Axios from 'axios';
import Header from './header';



export default class AddAmbassador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: '',
            error: '',
            submitSuccess: true
        };
    }
    goBack() {
        window.history.back()
    }

    onCodeKeyPress(e) {
        const re = /[0-9A-Z]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
        console.log(e.key)
    }

    submitAmbassador() {
        if(!this.state.name || !this.state.code) {
            this.setState({submitSuccess:false})
            return;
        }
        let auth = {
            method: 'POST',
            url: 'http://staging-api.micmaps.com/api/ambassadors',
            headers: {
                'Authorization' : window.sessionStorage.getItem('token')
            },
            data: {
              name: this.state.name,
              code: this.state.code
            }
          };
      
          return Axios(auth).then((res) => {
            console.log(res)
            if(res.status == 200) {
              this.props.history.push('/Ambassadors');
            }
          }).catch((err) => {
            console.log(err.response)
            alert(err.response.data.error || 'Some error occurred!');
          });
    }

    render() {
        return (
            <div>
                <Header title='Add Ambassodor' />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 className="heading text-center">Add Ambassador</h1>
                        </div>
                    </div>
                    <div className='form-container'>
                        <div className="row">
                            <div className="col-sm-12">
                                <form>
                                    <label>*Ambassador Full Name:</label>
                                    <input className='form-control' value={this.state.name} placeholder='Enter Ambassador Name' onChange={(ev) => this.setState({ name: ev.target.value })}></input>


                                    <label>*Ambassador Referral Code: (Should only be Alphabets (in CAPS) and Numbers allowed. e.g: HERO123)</label>
                                    <input className='form-control' value={this.state.code} placeholder='Enter Ambassador Code' onKeyPress={this.onCodeKeyPress} onChange={(ev) => this.setState({ code: ev.target.value })}></input>
                                    <button className="btn btn-primary btn-lg btn-block" type="button" style={{ marginTop: '15px' }} onClick={() => this.submitAmbassador()}>
                                        Submit
                                    </button>
                                    {this.state.submitSuccess ? null : <p style={{ textAlign: 'center', marginTop: '15px', color: 'red', fontSize: '15px' }}>Please fill in all required fields!</p>}
                                    <p style={{ textAlign: 'center', marginTop: '15px' }}>* - required fields</p>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
};