

import React, {PureComponent}  from 'react';
    
import {getRates} from '../../services'                       

  class Calc extends PureComponent {


    state = {
        notionValue:null,
        selectedCcy:null,
        selectedCcyValue:null,
        result:null
    }
    handleSelectChange = (e) => {
        const ccy = e.target.value;
        if (ccy.trim() === '') { return; }
        getRates(ccy).then((res) => {
           this.setState({selectedCcy:ccy, selectedCcyValue: res[`USD_${ccy}`].val});
        })
    }
    handleInputChange = (e) => {
        const notionValue = e.target.value;
        this.setState({notionValue});
    }
    handleGetResult = () => {
        this.setState({result: this.state.notionValue * this.state.selectedCcyValue});
    }
    render() {
        const {currencies} = this.props;
        return(
            <div className="right"> 
            calculator
            <select onChange={(e) => this.handleSelectChange(e)}>
             {[' ',...currencies].map((ccy, idx)=><option key={idx} value={ccy}>{ccy}</option>)}              
            </select> 
            <input placeholder="notionValue" onChange={(e) => this.handleInputChange(e)}/>
            <button disabled={!(this.state.notionValue && this.state.selectedCcyValue)} onClick={this.handleGetResult}>=</button>
            <input value={this.state.result || ''}/>
          </div>
        )
    }
  }

  export default Calc;