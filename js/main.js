let eventBus = new Vue()

Vue.component('desk', {
    template: `
    <div class='desk'>
    <button class="btn" @click="showModal = true">Создать задачу</button>
    <createTask v-if="showModal"></createTask>
    <div>
            <div>
                <col1></col1>
                <col2></col2>
                <col3></col3>
                <col4></col4>
            </div>
     </div>
    </div>
    `,
    data () {
        return {
            showModal: false
        }
    },
    updated () {
        eventBus.$on('close', close => {
            this.showModal = close;
        })
    }
})

Vue.component('col4', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
        </div>
        <h2>Законченные задачи</h2>
            <div>
                    <div v-for="task in fourthColList" class="col-item" :style="{ backgroundColor:task.color }">
                         <h3>{{ task.list_name}} </h3>
                         
                         <p class="title">Описание задачи:</p>
                         <p>{{task.taskDisc}}</p>
                         
                         <p class="title" v-if="task.reasonForReturn">Причина возврата на тестировании:</p>
                         <p v-if="task.reasonForReturn" v-for="reason in task.reasonForReturn">{{ reason }}</p>
                         
                         <p v-if="task.bag_report!=0" class="title">Баг-репорт:</p>
                         <p v-if="task.bag_report!=0" v-for="bug in task.bag_report">{{ bug }}</p>
                         
                         <p class="title">Дедлайн:</p>
                         <p>{{ task.deadLine }}</p>
                         
                         <p class="title">Дата выполнения задачи: </p>
                         <p>{{ task.doneDate }}</p>
                         
                         <p v-if="task.edited" class="title">Последнее редактирование:</p> 
                         <p> {{ task.edited }}</p>
                         
                         <p v-if="task.doneStatus" class="deadline-true">Сроки соблюдены</p>
                         <p v-else class="deadline-false title">Дедлайн просрочен</p>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            fourthColList: [],
            errors:[]
        }
    },
    methods: {
        del(task){
            this.fourthColList.splice(this.fourthColList.indexOf(task), 1);
        },

    },
    mounted() {
        eventBus.$on('takeFromThird', task => {
            task.doneDate = new Date();

            if (task.deadLine >= task.doneDate){
                task.doneStatus = true
            } else task.doneStatus = false;

            task.doneDate.toLocaleDateString()
            task.deadLine.toDateString();
            this.fourthColList.push(task);
        })
    }
})


Vue.component('col3', {
    template: `
        <div class="col">
        <div v-if="errors" v-for="error in errors" class="errors"">
                <p>{{ error }}</p>
        </div>
        <h2>Тестирование</h2>
            <div>
                    <div v-for="task in thirdColList" class="col-item" :style="{ backgroundColor:task.color }">
                        <div class="edit_form" v-if="task.edit">
                            <label class="title"for="list_name">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label class="title" for="taskDisk">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label class="title" for="deadLine">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)" class="btn">
                         </div>    
                         <div v-else>
                         <div v-if='show' class="reasonForReturn">
                            <label class="title" for="reason">Причина возврата</label>
                            <textarea id="reason" v-model="reason"></textarea>
                            <button @click="goLeft(task)" class="submit" class="btn">Вернуть</button>
                         </div>
                         <div v-else>
                             <h3>{{ task.list_name}} </h3>
                             
                             <p class="title">Описание задачи:</p> 
                             <p>{{task.taskDisc}}</p>
                             
                             <p class="title">Дедлайн:</p> 
                             <p> {{ task.deadLine }}</p>
                             
                             <p v-if="task.edited" class="title">Последнее редактирование:</p>
                             <p>{{ task.edited }}</p>
                             
                             <p v-if="task.bag_report!=0" class="title">Баг-репорт:</p>
                             <p v-if="task.bag_report!=0" v-for="bug in task.bag_report">{{ bug }}</p>
                             
                             <div class="btns">
                             <div>
                                <button class="del" @click="del(task)">Удалить</button>
                                <button class="edit" @click="edit(task)">Редактировать</button>
                             </div>
                             <div>
                                <button class="arrow" @click="returnTask(task)"><</button>
                                <button class="arrow" @click="goRight(task)"> > </button>
                             </div>
                             </div>
                         </div>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            show: false,
            reason: null,
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
        returnTask(task) {
            task.returned = true;
            this.show = true;
            task.color = '#FF6886';
        },
        goLeft(task){
            task.reasonForReturn.push(this.reason);
            this.reason = null;
            eventBus.$emit('takeBackFromThird', task);
            this.thirdColList.splice(this.thirdColList.indexOf(task), 1);
            this.show = false;
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
        <h2>Задачи в работе</h2>
            <div>
                    <div v-for="task in secondColList" class="col-item" :style="{ backgroundColor:task.color }">
                        
                        <div v-if="show">
                            <label class="title">Баг-репорт</label>
                            <textarea type="text" v-model="bag_report_itm"></textarea>
                            
                            <input type="submit" @click="go(task)" class="btn">
                        </div>
                        
                        <div v-else>
                         <div  class="edit_form" v-if="task.edit">
                            <label for="list_name" class="title">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label for="taskDisk" class="title">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label for="deadLine" class="title">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)" class="btn">
                         </div>                         
                         
                         <div v-else>
                             <h3>{{ task.list_name}} </h3>
                             
                             <p class="title">Описание задачи:</p> 
                             <p>{{ task.taskDisc }}</p>
                             
                             <p v-if="task.reasonForReturn!=0" class="title">Причина возврата:</p>
                             <p v-if="task.reasonForReturn!=0" v-for="reason in task.reasonForReturn">{{ reason }}</p>
                             
                             <p class="title">Дедлайн:</p> 
                             <p>{{ task.deadLine }}</p>
                             
                             <p v-if="task.edited" class="title">Последнее редактирование:</p>
                             <p>{{ task.edited }}</p>
                             
                             <p v-if="task.bag_report!=0" class="title">Баг-репорт:</p>
                             <p v-if="task.bag_report!=0" v-for="bug in task.bag_report">{{ bug }}</p>
                             
                             <div class="btns">
                             <div>
                                <button class="del" @click="del(task)">Удалить</button>
                                <button class="edit" @click="edit(task)">Редактировать</button>
                             </div>
                             <div>
                                <button class="arrow" @click="goLeft(task)"><</button>
                                <button class="arrow" @click="goRight(task)"> ></button>
                             </div>
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
        </div>
    `,
    data () {
        return {
            amount_itms:null,
            bag_report_itm: null,
            show: false,
            secondColList: [],
            errors:[]
        }
    },
    methods: {
        go(task){
            this.show = false;
            task.bag_report.push(this.bag_report_itm);
            task.color = "#7EE572";
            eventBus.$emit('takeFromSecond', task);
            this.secondColList.splice(this.secondColList.indexOf(task), 1);
        },
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
            if (task.returned){
                this.show = true;
            }
            else {
                eventBus.$emit('takeFromSecond', task);
                this.secondColList.splice(this.secondColList.indexOf(task), 1);
            }
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
                        
                         <div class="edit_form title" v-if="task.edit" >
                            <label for="list_name">Заголовок</label>
                            <input type="text" id="list_name" v-model="task.list_name">
                            
                            <label for="taskDisk" class="title">Описание задачи</label>
                            <input type="text" id="taskDisc" v-model="task.taskDisc">
                            
                            <label for="deadLine" class="title">Дедлайн</label>
                            <input type="date" id="deadLine" v-model="task.deadLine">
                            
                            <input type="submit" @click="saveChanges(task)" class="btn">
                         </div>                         
                         
                         <div v-else>
                             <h3>{{ task.list_name}} </h3>
                             
                             <p class="title">Описание задачи:</p>
                             <p>{{ task.taskDisc }}</p>
                             
                             <p v-if="task.reasonForReturn!=0" class="title">Причина возврата:</p>
                             <p v-if="task.reasonForReturn" v-for="reason in task.reasonForReturn">{{ reason }}</p>
                             
                             <p class="title">Дедлайн:</p> 
                             <p>{{ task.deadLine }}</p>
                             
                             <p v-if="task.edited" class="title">Последнее редактирование:</p> 
                             <p>{{ task.edited }}</p>
                              
                              <p v-if="task.bag_report!=0" class="title">Баг-репорт:</p>
                              <p v-if="task.bag_report!=0" v-for="bug in task.bag_report">{{ bug }}</p>
                             <div class="btns">
                             <div>
                                <button class="del" @click="del(task)">Удалить</button>
                                <button class="edit" @click="edit(task)">Редактировать</button>
                             </div>
                             <div>
                                <button class="arrow" @click="goRight(task)"> ></button>
                             </div>
                            </div>
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
            <div class="modal-mask">
                      <form @submit.prevent="onSubmit">
                      <p @click="close">X</p>
                        <h2>Создать список</h2>
                        <label class="list_name" for="list_name">Название</label>
                        <input type="text" v-model="list_name" id="list_name" required>
            
                        <label for="task">Описание задачи</label>
                        <textarea type="text" v-model="taskDisc" id="task" required></textarea>
                        
                        <label for="deadline">Дедлайн:</label>
                        <input type="date" v-model="deadline" required>             
                        
                        <input type="submit" class="btn"  @click="onSubmit">
                    </form>
            </div>
    `,
    data() {
        return {
            list_name: null,
            taskDisc:null,
            deadline: null
        }
    },
    methods: {
        close(){
            eventBus.$emit('close', false);
        },

        onSubmit() {
            eventBus.$emit('close', false);

            let taskList = {
                list_name: this.list_name,
                taskDisc: this.taskDisc,
                deadLine: new Date(this.deadline),
                doneDate: null,
                edit: false,
                edited: null,
                returned: false,
                reasonForReturn: [],
                doneStatus: null,
                color: null,
                bag_report:[]
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