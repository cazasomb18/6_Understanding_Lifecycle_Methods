////////////////////////////////////////////////////////////////////////////////////////////////////
//Introducing Lifecycle Methods
	//A lifecycle method is a function that we can optionally define inside of our class-based components

	//If we decide to implement these methods they will be called automatically by react at certain points

	//during a component's lifecycle
		//components will be rerendered, removed from the DOM, etc. depending upon our functionality
		//called at very distinct times during a lifecycle

	//constructor(){} is optional
	//render(){} is mandatory - technically render is a lifecycle

	//Component Lifecycle
		constructor(){} //is called

		render(){} //is called to return some JSX
			//content visible on screen

		componentDidMount(){}
		//called immediately one time after component is first rendered on screen
			//component then sits and waits for an update from setState() methods

		render(){}
				//each time componentDidUpdate(){} is called, immediately before it the render(){} is called again

		componentDidUpdate(){}
			//IF we define this function, it will be called each time component updates itself
				//sit and wait until this component is updated

		componentWillUnmount(){} 
			//will be called if/when we want a component to be REMOVED from the DOM

		//We will console.log(); the first two methods and view them in the console to prove their invocation




////////////////////////////////////////////////////////////////////////////////////////////////////
//Why Lifecycle Methods?
	//constructor(){} ==> good place to set our state or do one time data loading (initialize state, navigator)

	//render(){} ==> return JSX, ONLY FUNCTION OF RENDER(){} is to return JSX

	//componentDidMount(){} ==> good place to do data loading for component, or kick off some outside process (like geolocation)
		//documents state that data loading should be done inside the componentDidMount(){}
			//If you always initialize data inside of the cdm method then it will always lead to cleaner code
				//As a convention therefore we should do our data loading inside componentDidMount(){}

	//componentDidUpdate(){} ==> called everytime a component is updated
		//This is a good time to do more data loading when state/props change

	//SIT AND WAIT UNTIL THIS COMPONENT IS NO LONGER SHOWN

	//componentWillUnmount(){} ===> used to be used a lot more frequently, like to clean up features from another library
		//Good place to do cleanup (especially for non-react stuff)




////////////////////////////////////////////////////////////////////////////////////////////////////
//Refactoring Data Loading to Lifecycle Methods

	//since we're loading data from a call to navigator and waiting on the response, let's move that block to cdm(){}
	componentDidMount(){
		window.navigator.geolocation.getCurrentPosition(
			position => this.setState({lat: position.coords.latitude}),
			err => this.setState({errorMessage: err.message})
		);
	};
		//like so ^^^^^^

	//(1)Now our constructor has only one sole function, and that's to initialize state data
	constructor(props){
		super(props);

		this.state ={lat: null, errorMessage: ''}
	};
		//like so ^^^^^^

	//(2)HOWEVER WE CAN LOAD STATE WITHOUT A CONSTRUCTOR FUNCTION AT ALL
	constructor(props){
		super(props);
	};
	state = {lat: null, error: message ''};
		//like so ^^^^^^

		//These two approaches (1&2) both work in this situation
			//remember - Babel takes JSX and converts it into ES5 JS




////////////////////////////////////////////////////////////////////////////////////////////////////
//Passing State as Props
	//We've refactored the 2nd block in render(){} from this:
	if (!this.state.errorMessage && this.state.lat) {
			return <div>Latitude: {this.state.lat}</div>
		}

	//To this:
	if (!this.state.errorMessage && this.state.lat) {
			return <div><SeasonDisplay/></div>
		}
	//Now how do we get the latitude state into this component?
		//We'll add a property to SeasonDisplay and assign it {this.state.lat}
			//We're taking state from the app component and passing it down as a prop to SeasonDisplay
				//Everytime setState({}) is called it will rerender seasondisplay b/c it is a child of app

	//
