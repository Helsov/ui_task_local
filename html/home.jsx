const Router = window.ReactRouter.Router;
const Route = window.ReactRouter.Route;
const hashHistory = window.ReactRouter.hashHistory;
const Link = window.ReactRouter.Link;

class ShowPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            sort: false
        }
        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);

    }

    //Получаем данные из БД и сохраняем в массив через компонент который вызывется после рендеринга компонента, удобен для запроса к удаленным ресурсам
    componentDidMount(){
        document.querySelector('#homeHyperlink').className = "active";
        document.querySelector('#addHyperLink').className = "";
        this.getPost();
    }

    //добавялет id записи в урл к гет запросу
    updatePost(id){
        hashHistory.push('/addPost/' + id);
    }

    //Получаем сведения о записи
    getPost(){
        var self = this;
        axios.post('/getPost', {
        })
        .then((response) => {
          console.log('Полученные данные ',response);
          self.setState({posts:response.data})
        })
        .catch((error) => {
          console.log('error is ',error);
        });
      }
    
    //Удалаем запись
    deletePost(id){
        if (confirm('Действительно удалить?')){
            var self = this;
            axios.post('/deletePost',{
                id: id
            })
            .then((response) => {
                console.log("Запись удалена", response);
                self.getPost();
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    //Сортировка по приоритету
    sortPost(){
        var compareNumeric = (a, b) => {
            // if(a.levelPriority > b.levelPriority && this.state.sort == false) return -1;
            // if(a.levelPriority < b.levelPriority  && this.state.sort == true) return this.setState({
            //     sort: false
            // })
            // return 1;
            if(this.state.sort == false) return a.levelPriority - b.levelPriority;
            if(this.state.sort == true) return b.levelPriority - a.levelPriority;
            return this.setState({
                sort: false
            })
        }
        var posts =  this.state.posts.sort(compareNumeric);
        console.log(posts)
        this.setState({
            sort: true,
            posts: posts
        })

    }

    render(){
        return(
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Создатель</th>
                        <th>Название</th>
                        <th>Статус выполнения</th>
                        <th>Описание</th>
                        <th><button onClick={this.sortPost.bind(this)} type="button" className="btn btn-default">Приоритет</button></th>
                        <th>Планируемое время</th>
                        <th>Затраченное время</th>
                        <th>Дата</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.posts.map((post, index)=>{
                            return <tr key={index}>
                                        <th>{index + 1}</th>
                                        <th>{post.name}</th>
                                        <th>{post.title}</th>
                                        <th>{post.status}</th>
                                        <th>{post.subject}</th>
                                        <th>{post.priority}</th>
                                        <th>{post.planned}</th>
                                        <th>{post.spend}</th>
                                        <th>{post.date}</th>
                                        <th><span onClick={this.updatePost.bind(this, post._id)} className="glyphicon glyphicon-pencil"></span></th>
                                        <th><span onClick={this.deletePost.bind(this,post._id)} className="glyphicon glyphicon-remove"></span></th>
                                    </tr>
                        })
                    }
                </tbody>
            </table>
        )
    }
}

class AddPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            subject: '',
            id: '',
            status: '',
            priority: '',
            planned: '00:00',
            spend: '00:00',
            date: '',
            levelPriority: ''
        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
        this.addPost = this.addPost.bind(this)
        this.getPostWithId = this.getPostWithId.bind(this);
        this.handlePriority = this.handlePriority.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.handlePlanned = this.handlePlanned.bind(this);
        this.handleSpend = this.handleSpend.bind(this);
    }

    componentDidMount(){
        document.querySelector('#addHyperLink').className = "active";
        document.querySelector('#homeHyperlink').className = "";

        this.getPostWithId();
    }

    handleTitleChange(e){
        this.setState({
            title: e.target.value
        })
    }

    handleSubjectChange(e){
        this.setState({
            subject: e.target.value
        })
    }

    handlePriority(e){
        this.setState({
            priority: e.target.value
        })
        e.preventDefault();
    }

    handleStatus(e){
        this.setState({
            status: e.target.value
        })
        e.preventDefault();
    }

    handlePlanned(e){
        this.setState({
            planned: e.target.value
        })
    }

    handleSpend(e){
        this.setState({
            spend: e.target.value
        })
    }

    //Добавляем данные для создания нового поста
    addPost(){
        const myDate = new Date();
        const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        const fullDate = `${myDate.getDate()} ${months[myDate.getMonth()]} ${myDate.getFullYear()}`;

        const levelPriority = {
            "Высокий": 1,
            "Средний": 2,
            "Низкий": 3
        }
        
        axios.post('/addPost',{
            title: this.state.title,
            subject: this.state.subject,
            id: this.props.params.id,
            status: this.state.status,
            priority: this.state.priority,
            planned: this.state.planned,
            spend: this.state.spend,
            date: fullDate,
            levelPriority: levelPriority[this.state.priority]

        })
        .then((response) => {
            console.log(`Запись добавлена`, response);
            hashHistory.push('/');
        })
        .catch((error) => {
            console.log(error)
        })
    }

    //Получаем данные редактируемой записи задаем новый урл /getPostWithId
    getPostWithId(){
        var id = this.props.params.id;
        var self = this;
        axios.post('/getPostWithId',{
            id: id
        })
        .then((response) => {
            if(response){
              self.setState({
                  title: response.data.title,
                  subject: response.data.subject,
                  status: response.data.status,
                  priority: response.data.priority,
                  planned: response.data.planned,
                  spend: response.data.spend,
                  levelPriority: response.data.levelPriority
            });
            }
          })
          .catch( (error) => {
            console.log('ошибка ',error);
          });
    }

    render(){
        return(
            <div className="col-mf-5">
                <div className="form-area">
                    <form role="form">
                        <br styles="clear:both"/>
                        <div className="form-group">
                            <input value={this.state.title} type="text" onChange={this.handleTitleChange} className="form-control" id="title" placeholder="Название" required/>
                        </div>
                        <div className="form-group">
                            <textarea value={this.state.subject} className="form-control" onChange={this.handleSubjectChange} type="textarea" id="subject" placeholder="Описание" maxlength="140" rows="7"></textarea>
                        </div>
                        <div className="bs-example">
                        <div className="form-inline" role="form">
                            <div className="form-group">
                                <h5>Статус</h5>
                                <select id="status" value={this.state.status} onChange={this.handleStatus} className="form-control input-md">
                                    <option value=""></option>
                                    <option value="Новое">Новое</option>
                                    <option value="В процессе">В процессе</option>
                                    <option value="Готово">Готово</option>
                                </select>
                            </div>
                            &nbsp;
                            <div className="form-group">
                                <h5>Приоритет</h5>
                                <select id="priority" value={this.state.priority} onChange={this.handlePriority} className="form-control input-md">
                                    <option value=""></option>
                                    <option value="Высокий">Высокий</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Низкий">Низкий</option>
                                </select>
                            </div>
                            &nbsp;
                            <div className="form-group">
                                <h5>Планируемое время</h5>
                                <input value={this.state.planned} id="planned" onChange={this.handlePlanned} type="time" className="form-control" size="1"/>
                            </div>
                            &nbsp;
                            <div className="form-group">
                                <h5>Затраченное время</h5>
                                <input value={this.state.spend} id="spend" onChange={this.handleSpend} type="time" className="form-control" size="1"/>
                            </div>
                        </div>
                        </div>
                        <button type="button" id="submit" onClick={this.addPost} name="submit" className="btn btn-primary pull-right">Создать/Изменить</button>
                        <div className="clearfix"></div>
                    </form>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={ShowPost} path="/"></Route>
        <Route component={AddPost} path="/addPost(/:id)"></Route>
    </Router>,
    document.getElementById('app'));