import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from "react-tsparticles";
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


//將initialState存在App外面,裡頭放所有state prop的初始值
//這樣就可以不受App裡setState的影響
const initialState = {
  input: '',
  //input會隨輸入內容改變
  imageUrl: '',
  //imageUrl為input,而input會隨輸入內容改變
  box: {},
  //box object用來裝之後的position info
  route: 'signin',
  //用route變動來trigger if else statement
  //用if else statement來決定render之畫面
  isSignedIn: false,
  //用來控制Navigation顯示之按鍵內容
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
  //user用來裝server pass過來的新register的userInfo
}


class App extends Component{
  constructor(){
    super() //這裡不用assign props,因為App.js裏面用不到this.props
    this.state= initialState 
    //this.state = initialState,讓this.state仍可以去access之前那些prop
    //同時又不影響所有prop的初始值(all stored in initialState)
  }

  //在此測試fronend與backend連線是否正常,之後用不到
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(resp => resp.json())
  //   .then(data => console.log('users',data))
  // }

  loadUserInApp = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
     // password: data.hash ->password應該不會被回傳
        entries: data.entries,
        joined: data.joined
      }
    })
    // console.log(this.state.user)
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById("input_image")
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      left_col: width * clarifaiFace.left_col,
      top_row: height * clarifaiFace.top_row,
      right_col: width * (1-clarifaiFace.right_col),
      bottom_row: height * (1-clarifaiFace.bottom_row)
    }
    //return一個object
  }

  displayFaceBox = (boxPosition) =>{
    this.setState({box: boxPosition})
    //boxposition為calculateFaceLocation()之return object
  }

  //onInputChange用來針對form的onChange動作
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  //onButtonSubmit用來針對上傳照片的button的onClick動作
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    if(this.state.imageUrl){
      //在heroku app debug完以後,前端即可將fetch位置改為heroku app的位置
      return fetch('https://intense-sands-04316.herokuapp.com/imageurl',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.imageUrl
        })
      })
      .then(data => data.json())
      .then(resp => {
        if(resp){
          fetch('https://intense-sands-04316.herokuapp.com/image',{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(imageResp => imageResp.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(resp))
      }).catch(err => console.log("try again"))
    }
  }

  //onRouteChange用來針對signin submit與navigation signout的onClick動作
  onRouteChange = (routeChange) => {
    if(routeChange === 'signin' || routeChange === 'register'){
      this.setState(initialState) 
      //在登入畫面(或登出後)&註冊畫面,所有state prop為初始值,也就是initialState
    }else if(routeChange === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: routeChange})
  }

  render(){
    const particlesInit = (main) => {
      // console.log(main);
    };
    const particlesLoaded = (container) => {
      // console.log(container);
    };
    const {isSignedIn,route,imageUrl,box} = this.state;
    //destructure
    return(
      <div>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        <Particles
              className="particles"
              id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
              options={{
                fpsLimit: 60,
                interactivity: {
                  events: {
                    onClick: {
                      enable: true,
                      mode: "push",
                    },
                    onHover: {
                      enable: true,
                      mode: "repulse",
                    },
                    resize: true,
                  },
                  modes: {
                    bubble: {
                      distance: 400,
                      duration: 2,
                      opacity: 0.8,
                      size: 40,
                    },
                    push: {
                      quantity: 4,
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4,
                    },
                  },
                },
                particles: {
                  color: {
                    value: "#ffffff",
                  },
                  links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                  },
                  collisions: {
                    enable: true,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outMode: "bounce",
                    random: false,
                    speed: 2,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                    },
                    value: 80,
                  },
                  opacity: {
                    value: 0.1,
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    random: true,
                    value: 3,
                  },
                },
                detectRetina: true,
              }}
            />
        {route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box}/>
          </div>
        : (route === 'signin'
          ? <Signin loadUser={this.loadUserInApp} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUserInApp} onRouteChange={this.onRouteChange}/>    
          )
        } 
      </div>
    )
  }
}

export default App;
