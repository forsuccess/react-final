import React, { Component } from 'react';
import './TodoInput.css'
import './TodoItem.css'
export default class TodoInput extends Component{
    render(){
        return <input type="text" value={this.props.content}
                      className="TodoInput"
                      onKeyPress={this.submit.bind(this)}
                      onChange={this.changeTitle.bind(this)}/>
    }
    submit(e){
        if(e.key=='Enter'){
            this.props.onSubmit(e)
        }
    }
    changeTitle(e){
        this.props.onChange(e)
    }
}