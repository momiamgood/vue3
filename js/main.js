let eventBus = new Vue()

Vue.component('desk', {
    template: `
    <div class='desk'>
     <div>
            <createTask></createTask>
            <div>
                <col1></col1>
                <col2></col2>
                <col3></col3>
                // четвертая колонка
            </div>
     </div>
    </div>
    `,
})


Vue.component('col3', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
        </div>
        <h2>Запланированные задачи</h2>
            <div>
                    <div v-for="task in thirdColList" class="col-item">
                        
                         <div class="edit_form" v-if="task.edit">
                            <label for="list_name">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label for="taskDisk">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label for="deadLine">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)">
                         </div>                         
                         
                         
                         <h3>{{ task.list_name}} </h3>
                         <p>Описание задачи: {{task.taskDisc}}</p>
                         <p>Дедлайн: {{ task.deadLine }}</p>
                         <p v-if="task.edited">Посденее редактирование: {{ task.edited }}</p>
                         
                         <div class="btns">
                            <button @click="del(task)">Удалить</button>
                            <button @click="edit(task)">Редактировать</button>
                            <button @click="goLeft(task)">< Тут будет стрелочка</button>
                            <button @click="goRight(task)"> Тут будет стрелочка > </button>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            thirdColList: [],
            errors:[]
        }
    },
    methods: {
        del(task){
            this.thirdColList.splice(this.thirdColList.indexOf(task), 1);
        },
        edit(task) {
            task.edit = true;
        },
        saveChanges(task){
            task.edited = new Date();
            task.edit = false;
        },
        goRight(task){
            eventBus.$emit('takeFromThird', task);
            this.thirdColList.splice(this.thirdColList.indexOf(task), 1);
        },
        goLeft(task){
            eventBus.$emit('takeBackFromThird', task);
            this.thirdColList.splice(this.thirdColList.indexOf(task), 1);
        }

    },
    mounted() {
        eventBus.$on('takeFromSecond', task => {
            this.thirdColList.push(task);
        })
    }
})


Vue.component('col2', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
        </div>
        <h2>Запланированные задачи</h2>
            <div>
                    <div v-for="task in secondColList" class="col-item">
                        
                         <div class="edit_form" v-if="task.edit">
                            <label for="list_name">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label for="taskDisk">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label for="deadLine">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)">
                         </div>                         
                         
                         
                         <h3>{{ task.list_name}} </h3>
                         <p>Описание задачи: {{task.taskDisc}}</p>
                         <p>Дедлайн: {{ task.deadLine }}</p>
                         <p v-if="task.edited">Посденее редактирование: {{ task.edited }}</p>
                         
                         <div class="btns">
                            <button @click="del(task)">Удалить</button>
                            <button @click="edit(task)">Редактировать</button>
                            <button @click="goLeft(task)">< Тут будет стрелочка</button>
                            <button @click="goRight(task)"> Тут будет стрелочка > </button>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            secondColList: [],
            errors:[]
        }
    },
    methods: {
        del(task){
            this.secondColList.splice(this.secondColList.indexOf(task), 1);
        },
        edit(task) {
            task.edit = true;
        },
        saveChanges(task){
            task.edited = new Date();
            task.edit = false;
        },
        goRight(task){
            eventBus.$emit('takeFromSecond', task);
            this.secondColList.splice(this.secondColList.indexOf(task), 1);
        },
        goLeft(task){
            eventBus.$emit('takeBackFromSecond', task);
            this.secondColList.splice(this.secondColList.indexOf(task), 1);
        }

    },
    mounted() {
        eventBus.$on('takeFromFirst', task => {
            this.secondColList.push(task);
        })

        eventBus.$on('takeBackFromThird', task => {
            this.secondColList.push(task);
        })
    }
})

Vue.component('col1', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
        </div>
        <h2>Запланированные задачи</h2>
            <div>
                    <div v-for="task in firstColList" class="col-item">
                        
                         <div class="edit_form" v-if="task.edit">
                            <label for="list_name">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label for="taskDisk">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label for="deadLine">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)">
                         </div>                         
                         
                         
                         <h3>{{ task.list_name}} </h3>
                         <p>Описание задачи: {{task.taskDisc}}</p>
                         <p>Дедлайн: {{ task.deadLine }}</p>
                         <p v-if="task.edited">Посденее редактирование: {{ task.edited }}</p>
                         
                         <div class="btns">
                            <button @click="del(task)">Удалить</button>
                            <button @click="edit(task)">Редактировать</button>
                            <button @click="goRight(task)"> Тут будет стрелочка > </button>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            firstColList: [],
            errors:[]
        }
    },
    methods: {
        del(task){
            this.firstColList.splice(this.firstColList.indexOf(task), 1);
        },
        edit(task) {
            task.edit = true;
        },
        saveChanges(task){
            task.edited = new Date();
            task.edit = false;
        },
        goRight(task){
            eventBus.$emit('takeFromFirst', task);
            this.firstColList.splice(this.firstColList.indexOf(task), 1);
        },


    },
    mounted() {
        eventBus.$on('CreateTaskList', list => {
            this.firstColList.push(list);
        })
        eventBus.$on('takeBackFromSecond', task => {
            this.firstColList.push(task);
        })
    }
})


Vue.component('createTask', {
    template: `
        <form @submit.prevent="onSubmit">
        <h2>Создать список</h2>
            <label class="list_name" for="list_name">Название</label>
            <input type="text" v-model="list_name" id="list_name" required>

            <label for="task">Описание задачи</label>
            <textarea type="text" v-model="taskDisc" id="task" required></textarea>
            
            <label for="deadline">Дедлайн:</label>
            <input type="date" v-model="deadline" required>             
            
            <input type="submit" class="btn">
        </form>
    `,
    data() {
        return {
            list_name: null,
            taskDisc:null,
            deadline: null
        }
    },
    methods: {
        onSubmit() {
            let taskList = {
                list_name: this.list_name,
                taskDisc: this.taskDisc,
                deadLine: this.deadline,
                doneDate: new Date(),
                edit: false,
                edited: null
            }
            eventBus.$emit('CreateTaskList', taskList);
            this.list_name = this.deadline = this.taskDisc = null;
        }
    }
})


let app = new Vue({
    el: '#app',
    data: {
        name: 'Заметки'
    }
})