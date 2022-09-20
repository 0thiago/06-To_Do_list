
const Main = {

  tasks: [], //MAIN TASK LIST

  //INIT
  init: function () {

    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()
    this.buildTasks()

  },

  //CACHE
  cacheSelectors: function () {

    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$taskList = document.querySelector('#taskList')
    this.$removeButtons = document.querySelectorAll(".remove")

  },

  //BIND
  bindEvents: function () {

    const self = this

    this.$checkButtons.forEach(function (checkButtons) {
      checkButtons.onclick = self.Events.checkButton_click

    })

    this.$removeButtons.forEach(function (removeButtons) {
      removeButtons.onclick = self.Events.removeButton_click.bind(self)
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

  },

  getStoraged: function () {
    const storagedTasks = localStorage.getItem('tasks')

    if (storagedTasks) {
      this.tasks = JSON.parse(storagedTasks)
    } else {  
      localStorage.setItem('tasks', JSON.stringify([]))
    }  
  },

  getTaskHTML: function (task) {
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

  getTaskHTMLDone: function (task) {
    return `
    <li class="done">
      <div class="check"></div>
      <label for="" class="task">
        ${task}
      </label>
      <button class="remove" data-task="${task}"></button>
    </li>
    `
  },

  buildTasks: function () {
    
    this.tasks.forEach((element) => {
      if (element.done == true) {
        console.log(this.$taskList.innerHTML)
        this.$taskList.innerHTML += this.getTaskHTMLDone(element.task)        
      } else {
        this.$taskList.innerHTML += this.getTaskHTML(element.task) 
      }
    })    

    this.cacheSelectors()
    this.bindEvents()

  },

  //EVENTS
  Events: {

    checkButton_click: function (checkButtonEventClick) {

      const self = Main
      const li = checkButtonEventClick.target.parentElement
      const isDone = li.classList.contains('done')
      const taskDone = checkButtonEventClick.target.nextSibling.nextSibling.nextSibling.nextSibling.dataset['task']


      if (!isDone) {
        li.classList.add('done')
        self.tasks.forEach((element)=>{
          if (element.task === taskDone) {
            element.done = true
            console.log(self.tasks)
          }
        })
      } else {
        li.classList.remove('done')
        self.tasks.forEach((element)=>{
          if (element.task === taskDone) {
            element.done = false
            console.log(self.tasks)
          }
        })
      }

      localStorage.setItem('tasks', JSON.stringify(self.tasks))

    },

    removeButton_click: function (removeButtonEventClick) {

      const li = removeButtonEventClick.target.parentElement
      const taskRemovedValue = removeButtonEventClick.target.dataset['task']

      const newTaskState = this.tasks.filter(element => element.task !== taskRemovedValue)

      localStorage.setItem('tasks', JSON.stringify(newTaskState))
      this.tasks = newTaskState //update main task list

      li.classList.add('removed')

      setTimeout(function () {
        li.classList.add('hidden')
      }, 200)

    },

    inputTask_keypress: function (inputTask_keypress) {

      const key = inputTask_keypress.key
      const inputTask = inputTask_keypress.target.value

      if (key === 'Enter') {

        this.$taskList.innerHTML += this.getTaskHTML(inputTask)

        inputTask_keypress.target.value = ``

        this.cacheSelectors()
        this.bindEvents()

        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObj = JSON.parse(savedTasks)

        const obj = [          
          { task: inputTask, done: false },
          ...savedTasksObj,
        ]

        const objJSON = JSON.stringify(obj)

        this.tasks = obj //update on main tasks list
        localStorage.setItem('tasks', objJSON)
      }
    }
  }
}

Main.init()



