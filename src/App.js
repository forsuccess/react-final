import React, { Component } from 'react';
import TodoItem from './TodoItem'
import TodoInput from './TodoInput'
import UserDialog from './UserDialog'
import './reset.css'
import 'normalize.css'
import './App.css'
import {updateListTable} from './leanCloud';
import {getCurrentUser, signOut, TodoModel} from './leanCloud'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        user: getCurrentUser() || {},
      newTodo: '',
      todoList: []

    }
      let user = getCurrentUser()
      if (user) {
          TodoModel.getByUser(user, (todos) => {
              let stateCopy = JSON.parse(JSON.stringify(this.state))
              stateCopy.todoList = todos
              this.setState(stateCopy)
          })
      }
  }
  render() {
    let todos = this.state.todoList.filter((item)=> !item.deleted).map((item,index)=>{
           return (
               <li key={index}><TodoItem todo={item} onToggle={this.toggle.bind(this)}
                                         onDelete={this.delete.bind(this)}/></li>
           )
             })
      let todos_finish = this.state.todoList.filter((item)=>item.status).filter((item)=> !item.deleted).map((item,index)=>{
          return (
              <li key={index}><TodoItem todo={item} onToggle={this.toggle.bind(this)}
                                        onDelete={this.delete.bind(this)}/></li>
          )
      })
      let todos_no = this.state.todoList.filter((item)=>!item.status).filter((item)=> !item.deleted).map((item,index)=>{
          return (
              <li key={index}><TodoItem todo={item} onToggle={this.toggle.bind(this)}
                                        onDelete={this.delete.bind(this)}/></li>
          )
      })

    return (
      <div className="App">
          <div className="top">
              <h1>{this.state.user.username||'我'}的待办

              </h1>
              {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
          </div>

          <div className="inputWrapper">
       <TodoInput content={this.state.newTodo} onSubmit={this.addTodo.bind(this)}
                  onChange={this.changeTitle.bind(this)}
                  />
          </div>
          <h2>已完成</h2>
          <ol className="todoList">{todos_finish}</ol>
          <h2>未完成</h2>
          <ol className="todoList">{todos_no}</ol>
          {this.state.user.id ?
              null :
              <UserDialog
                  onSignUp={this.onSignUpOrSignIn.bind(this)}
                  onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
      </div>
    );
  }
  signOut(){//按钮点击大概也是这样的事件只不过todos是把status=completed的项目挑选出来
        signOut()
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.user = {}
        this.setState(stateCopy)
    }
    onSignUpOrSignIn(user){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.user = user
        this.setState(stateCopy)
    }
    componentDidUpdate(){

         }
  addTodo(event) {
      let newTodo = {
          title: event.target.value,
          status: '',
          deleted: false
      }
      TodoModel.create(newTodo, (id) => {
          newTodo.id = id
          this.state.todoList.push(newTodo)
          this.setState({
              newTodo: '',
              todoList: this.state.todoList
          })
      }, (error) => {
          console.log(error)
      })

  }
  changeTitle(event){
        this.setState({
              newTodo: event.target.value,
            todoList: this.state.todoList
        })

      }
    toggle(e,todo){
        let oldStatus = todo.status
        todo.status=todo.status==='completed' ? '':'completed'
        updateListTable(this.state.user, todo.id, 'status', todo.status);
        TodoModel.update(todo, () => {
            this.setState(this.state)
        }, (error) => {
            todo.status = oldStatus
            this.setState(this.state)
        })

    }
    delete(e,todo){
        TodoModel.destroy(todo.id, () => {
            todo.deleted = true
            this.setState(this.state)
        })

    }
}

export default App;
