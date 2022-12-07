import { useState } from 'react'
import React from 'react'
import './Modal.css'


class Modal extends React.Component {
  constructor(props){
    super();
    this.state = {
      sha128Progress: 0.00,
      md5Progress: 0.00,
      testRunning: true,
      md5Won: false
    }
  }

  componentDidMount(){

    let sha128Duration = 0;
    let md5Duration = 0;
          
    if(this.props.data == "1000000"){
      sha128Duration = 911;
      md5Duration = 839;
    } else if(this.props.data == "10000000"){
      sha128Duration = 9308;
      md5Duration = 8319;
    } else if(this.props.data == "100000000"){
      sha128Duration = 94096;
      md5Duration = 87063;
    } else {
      sha128Duration = 1;
      md5Duration = 1;
    }

    this.setState({startTime: Date.now()})
    
    let factorToIncreaseCompletionRateSha128 = 100/(sha128Duration / 100);
    let factorToIncreaseCompletionRateMd5 = 100/(md5Duration / 100);
    
    
    const sha128Timer = setInterval(() => {
        if(this.state.sha128Progress < 100){
          let addAmount = (this.state.sha128Progress + factorToIncreaseCompletionRateSha128) > 100 ? 100 : (this.state.sha128Progress + factorToIncreaseCompletionRateSha128)
          this.setState({
            sha128Progress: addAmount, 
          })
        }
      }, 100)
    
    const md5Timer = setInterval(() => {
        if(this.state.md5Progress < 100){
          let addAmount = (this.state.md5Progress + factorToIncreaseCompletionRateMd5) > 100 ? 100 : (this.state.md5Progress + factorToIncreaseCompletionRateMd5)
          this.setState({
            md5Progress: addAmount
          })
        }
      }, 100)

    setTimeout(() => { // for sha128 duration
      clearInterval(sha128Timer)
      this.setState({
        testRunning: false
      })
      if(this.state.sha128Progress < 100) this.setState({sha128Progress: 100})
    }, sha128Duration)
    
    setTimeout(() => { // for md5 duration
      clearInterval(md5Timer)
      setTimeout(() => {
        this.setState({md5Won: true})
      }, 300)
      if(this.state.md5Progress < 100) this.setState({md5Progress: 100})
    }, md5Duration)
  }

  render(){
    const { disabledBtn } = this.props;
    return (
      <div className="modal-container" >
        <div className="modal-blur-background" ></div>
        <div className="modal-data-container" >

          <div className={`racer-container ${this.state.md5Won ? 'racer-winner' : null}`} >
            <h4>MD5</h4>
            <p>Hashed: <span>{Math.round(this.state.md5Progress * 10) / 10}%</span></p>
          </div>
          <div className={`racer-container ${this.state.md5Won ? 'racer-loser' : null}`} >
            <h4>SHA128</h4>
            <p>Hashed: <span>{Math.round(this.state.sha128Progress * 10) / 10}%</span></p>
          </div>
          <div className="see-results-btn" >
            <button disabled={disabledBtn} onClick={() => this.props.closeModal()} >See results</button>
          </div>
          {this.state.md5Won ? 
            <div className="won-medal" >
              <p>MD5 Wins!</p>
              <img src="https://icons.veryicon.com/png/128/miscellaneous/trophy-icon/trophy-1-1.png" />
            </div> : null}
          
          {this.state.md5Won == false ? 
            (<div className="albert-dancing" >
              <div className="albert-text" >Go MD5!</div>
            <iframe src="https://giphy.com/embed/WqL5cs7RYZYeb18iI4" frameBorder="0"></iframe></div>) :
            (<div className="albert-dancing" >
              <div className="albert-text" >Another win for Albert!</div>
            <iframe src="https://giphy.com/embed/h7jnYeux0klwfS6NAc" frameBorder="0"></iframe></div>)
          }

          {this.state.md5Won == false ? 
            (<div className="alberta-dancing" >
            <div className="albert-text" >You got this Sha128!</div>
            <iframe src="https://giphy.com/embed/Y3eKwENT89IQc9BHcK" frameBorder="0" class="giphy-embed"></iframe></div>) :
            (<div className="alberta-dancing" >
            <div className="albert-text" >Someone is sleeping on the couch tonight...</div>
            <iframe src="https://giphy.com/embed/emMS809xqH6pndL8iD" frameBorder="0" class="giphy-                  embed"></iframe></div>)
          }

        </div>
      </div>
    )
  }
}

export default Modal;
