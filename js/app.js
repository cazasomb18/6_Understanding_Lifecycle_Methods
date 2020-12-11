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


////////////////////////////////////////////////////////////////////////////////////////////////////
//Determining season
	//All we really need to do now is get the current month to determine the season
		//In browser console: new Date().getMonth(); === 11, which is December, starts @ 0.


	//Define new function in SeasonDisplay whose sole function is to determine the current month.

		const getSeason = (lat, month) => {
			if (month > 2 && month < 9) {
				return lat > 0 ? 'summer' : 'winter'
			} else {
				return lat > 0 ? 'winter' : 'summer'
			}
		};

	//Now we incorporate logic to display what season it is in the return statement
		return (
			<div>{if season === 'winter' ? 'Burr, it\'s chilly!' : 'Let\'s hit the beach!'}</div>
		);

	//The ReactJS community is divided as to whether or not you should put that much logic into 
	//into the return statement, so here is an alternative, with the logic ABOVE the return statement...
	const text = if season === 'winter' ? 'Burr, it\'s chilly!' : 'Let\'s hit the beach!'

	return (
		<div>{text}</div>
	);

////////////////////////////////////////////////////////////////////////////////////////////////////
//Icons Not loading and CORS errors
	//We will be adding some font icons from teh Semantic UI Lib, there is a CDN bug that some students
	//are hitting where the icons no longer load and throw a CORS error after changing the brower's location 
	//sensors. The CDN.js docs add the integrity and crossorigin parameters to your script by default,
	//which is breaking when we change the location sensors.

	//Change the script to look like this:

		//<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />

	//Stop the server and close your browser (if you miss full closing the browser adn error will persist).
	//Then restart your server.  If this does not resolve your issue, you can also choose to install the CSS
	//library locally. 

		//npm install semantic-ui-css

	//Then import the library into your root index.js component:
		//import "semantic-ui-css/semantic.min.css";



////////////////////////////////////////////////////////////////////////////////////////////////////
//Showing Icons
	//We'll be using semantic-ui again for icons
		//Snowflake for winter, and sun for summer

	//Logic for displaying icons:
		const icon = season === 'winter' ? 'snowflake' : 'sun';
			//*** note: this ternary statement is almost identical to the const text = ternary

////////////////////////////////////////////////////////////////////////////////////////////////////
//Extracting Options to Configure Objects
	//There are two problems with our code at the moment:
		//We have two basically duplicated ternary expressions
		//We assigned the name of our icon to use to a var named icon, the string template repeats the word icon twice.
			//We will use a pattern to solve this problem that is repeatable and very useful:

		//Create a configuration object at the top of the file like so: 
		const seasonConfig = {
			summer: {
				text: 'Let\'s hit the beach!',
				iconName: 'sun'
			},
			winter: {
				text: 'Burr it\'s cold!',
				iconName: 'snowflake'
			}
		};

		//Replace 
			const text = season === 'winter' ? 'Burr, it\'s Chilly!' : 'Let\'s hit the beach!'
			const icon = season === 'winter' ? 'snowflake' : 'sun';
		//With
			seasonConfig[season]; //{ text, iconName }
				//All different options are plainly spelled out in the seasonConfig obj
				//If anyone wants to update the text, iconName or icon itself it would be very easy!

		//Destructure out the text and iconName from seasonConfig like so:
			const { text, iconName } = seasonConfig[season];
				//note how text and iconName are the same vars used in the seasonConfig object;
					//this ^^^ syntax allows use to pull these variables out that are nested in the object
						//this allows us to interpolate the values into the <i/> tags in the return statement




////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding some styling

	//Add a file in src dir called 'SeasonDisplay.css' ==> indicates to anyone looking at this project
	//that it's only meant to modify the season display component

	//add classNames 'icon-left' and 'icon-right' to the <i> tags so we can style them in the .css file!

	//Next, we import the css fileinto the SeasonDisplay file
		import './SeasonDisplay.css'; //<-- like so
			//note: webpack is going to see that we're importing a cssfile, will take contents out of there and 
			//stick them into the public/index.html file

	//Add className to SeasonDisplay <div>
		<div className={`season-display ${season}`}></div>
			//note: notice the interpolation of the season variable within the className -> returns 'summer' || 'winter'
				//*this gives us the sort of automatic functionality we want when we configure the .css options

				//now we can add styling to the class .season-display{} to configure the containing <div>
					//we'll create .css classes of .winter{}/.summer{} to change the background-color of the <div>
					//classes .season-display.season i {} selects all <i> tags w/ classes season-display && season to
					//toggle the color of the icons.



////////////////////////////////////////////////////////////////////////////////////////////////////
//Showing a Loading Spinner
	//Let's think about the first time user-experience - all we have is the white background w/ the 'loading...' text
		//this isn't very user friendly so we'll add a loading spinner from semantic-ui>loader menu

	//Whenever we're putting together a React App we want to always TRY to make reusage components...
		//So we're going to create a functional component whose sole job is to show a spinning loading logo.




////////////////////////////////////////////////////////////////////////////////////////////////////
//Specifying Default Props
	//Showing the text loading is kind of unclear in the spinner, so we want to customize the text
		//Whenever we want to customize the appearance of a component we use the props system
		const Spinner = (props) => {}; //<-- like so

		//Then we add the property to the our rendering of spinner on index.js
		<Spinner message={"Please accept location request"} /> //<-- like so

		//However, this isn't maybe the best way b/c we have to hardcode a message property into the component
		//If we forget to put a message property inside the spinner we only get the animation and no text
			//So we want to add default text - there are two ways we can do this:

			//1 - on Spinner.js
			<div class="ui big text loader">{props.message || 'Loading...'}</div>

			//2 - on Spinner.js BETTER WAY TO APPROACH THIS
			Spinner.defaultProps = {
				message: 'Loading...'
			};
				//this will provide us with a default message to the Spinner component
				//method one will override the default message, giving us a fallback incase we forget to hardcode



////////////////////////////////////////////////////////////////////////////////////////////////////
//Avoiding Conditionals in Render
	//Let's say we wanted to include a 10px solid red border on the Spinner.js <div></div>
		//This would be very hard to do because we have three seperate conditionally rendered displays
		//that would each have to be configured with duplicate code
			//How do work around this?

	//The root of our problem is that we have all of this conditionally rendered logic inside of the render(){}
		//SOLUTION: create a helper function above render(){}

