
const Main = { //Main = object

  tasks: [],

  init: function () { //Object that init calls the functions

    //'this' reffers to Main const   
    //We have to use 'this.var(...)' cause the var itself doesnt exist, it is a property inside the main object (Main).
    //So, cacheSelectors doesnt exist, because it is a property inside Main, so it is Main.cacheSelectors.

    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()
    this.buildTasks()    

  },

  cacheSelectors: function () { //Object cache will storage the variables

    //this is the same let checkButton = ...
    //but 'this' allow you to access it in the whole Main const 

    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$taskList = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll(".remove")

  },

  bindEvents: function () { //This object relates (binds) the Events to their triggers

    const self = this //duplicate 'this(Main)' inside 'self' var, so we can use 'self' instead 'this' inside bindEvents functions  

    //since we used SelectorALL we cant apply directly a function
    //we need roam the array SelectorALL and apply 1 by 1
    //forEach will roam each button and attrib them the function

    this.$checkButtons.forEach(function (checkButtons) {//here 'checkButtons' turns into 'this.$checkButtons' so we can access its properties inside of itself
      checkButtons.onclick = self.Events.checkButton_click.bind(this)

    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this) //use .bind(this) in order to get the Main this. Works when you pass the event directly to the var. It doesnt work if the var receive a function and the event inside of it

    this.$removeButtons.forEach(function (removeButtons) {
      removeButtons.onclick = self.Events.removeButton_click.bind(self)
    })

  }, 

  getStoraged: function() {
    const tasks = localStorage.getItem('tasks')
    this.tasks = JSON.parse(tasks)
  },

  getTaskHtml: function(task) {
    return `
    <li>
    <div class="check"></div>
    <label for="" class="task">
      ${task}
    </label>
    <button class="remove" data-task="${task}"></button>
  </li>
    `
  },

  buildTasks: function(){
    let html = ' '

    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task)
    })

    this.$taskList.innerHTML = html

    this.cacheSelectors()
    this.bindEvents()
  },

  Events: { //create the event functions

    checkButton_click: function (checkButtonEventClick) { //here 'checkButtonEventClick' turns into 'checkButton_click' so we can access its properties inside of itself

    //on events, 'this' will be the html of the event target
    //console.log(this)
      const li = checkButtonEventClick.target.parentElement
      const isDone = li.classList.contains('done')

      //good practices:
      //on 'IFs' always check the negation first      
      if (!isDone) {

        //use return to execute the line instead jump for next one
        return li.classList.add('done')

      } //avoid 'ELSEs', it costs more resources on big apps
      li.classList.remove('done')
    },

    removeButton_click: function(removeButtonEventClick){

      const li = removeButtonEventClick.target.parentElement
      const taskValue = removeButtonEventClick.target.dataset['task']

      console.log(removeButtonEventClick.target.dataset['task'])
      
      const newTaskState = this.tasks.filter(item => item.task !== taskValue)

      localStorage.setItem('tasks', JSON.stringify(newTaskState))
      
      li.classList.add('removed')

      setTimeout(function(){
        li.classList.add('hidden')
      }, 200)

    },

    inputTask_keypress: function (inputTask_keypress) {

      const key = inputTask_keypress.key
      const inputTask = inputTask_keypress.target.value

      
      if (key === 'Enter') {
        // console.log(inputTask) TARGET

        this.$taskList.innerHTML += this.getTaskHtml(inputTask)
        
        //whenever you change html structure involved with events, you need to reload them cache and binds
        inputTask_keypress.target.value = ``
        this.cacheSelectors() 
        this.bindEvents()

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObj = JSON.parse(savedTasks)

        const obj = [
          {task: inputTask},
          ...savedTasksObj, //spreadOperator
        ]

        localStorage.setItem('tasks', JSON.stringify(obj))
      }

      
    }

  }

}

Main.init()



