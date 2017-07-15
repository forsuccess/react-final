import React, { Component } from 'react';
import TodoItem from './TodoItem'
import TodoInput from './TodoInput'
import * as localStore from './localStore'
import './reset.css'
import 'normalize.css'
import './App.css'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTodo: '',
      todoList: localStore.load('todoList')||[]

    }
  }
  render() {
    let todos = this.state.todoList.filter((item)=> !item.deleted).map((item,index)=>{
           return (
               <li key={index}><TodoItem todo={item} onToggle={this.toggle.bind(this)}
                                         onDelete={this.delete.bind(this)}/></li>
           )
             })

    return (
      <div className="App">
        <h2>我的备忘录</h2>
          <div className="inputWrapper">
       <TodoInput content={this.state.newTodo} onSubmit={this.addTodo.bind(this)}
                  onChange={this.changeTitle.bind(this)}
                  onDelete={this.delete.bind(this)}/>
          </div>
        <ol className="todoList">{todos}</ol>
      </div>
    );
  }
    componentDidUpdate(){
            localStore.save('todoList', this.state.todoList)
         }
  addTodo(event) {
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })

  }
  changeTitle(event){
        this.setState({
              newTodo: event.target.value,
            todoList: this.state.todoList
        })

      }
    toggle(e,todo){
        todo.status=todo.status==='completed' ? '':'completed'
        this.setState(this.state)

    }
    delete(e,todo){
        todo.deleted=true
        this.setState(this.state)

    }
}

export default App;
let id = 0

    function idMaker(){
      id += 1
            return id
          }