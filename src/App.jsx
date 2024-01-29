import React from 'react';
import tweetLogo from './assets/twitter-icon.svg';
import './index.css';
import {FaTwitter,FaQuoteLeft,FaQuoteRight} from "react-icons/fa"
import { createRoot } from "react-dom/client";
import {createStore,applyMiddleware} from 'redux';
import {Provider,connect}from 'react-redux';
import {thunk} from 'redux-thunk';


const FETCH_QUOTE_REQUEST='FETCH_QUOTE_REQUEST';
const FETCH_QUOTE_SUCCESS='RECEIVE_QUOTE_SUCCESS';
const FETCH_QUOTE_FAILURE='RECEIVE_QUOTE_FAILURE';

const fetchQuoteRequest = () => ({ type: FETCH_QUOTE_REQUEST });
const fetchQuoteSuccess = (quote) => ({ type: FETCH_QUOTE_SUCCESS, payload: quote });
const fetchQuoteFailure = (error) => ({ type: FETCH_QUOTE_FAILURE, payload: error });

const fetchQuote = () => {
  return async dispatch => {
    dispatch(fetchQuoteRequest());

    try {
      const response = await fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json');
      const data = await response.json();

      const randomIndex = Math.floor(Math.random() * data.quotes.length);
      const randomQuote = data.quotes[randomIndex];

      dispatch(fetchQuoteSuccess(randomQuote));
    } catch (error) {
      dispatch(fetchQuoteFailure(error));
    }
  };
};


const initialState={
  quote:'',
  author:'',
  isLoading:false,
  error:null
};
const quoteReducer=(state=initialState,action)=>{
  switch (action.type) {
    case FETCH_QUOTE_REQUEST:
      return{
        ...state,
        isLoading:true,error:null
      }
    case FETCH_QUOTE_SUCCESS:
      return{
        ...state,
        isLoading:false,
        quote:action.payload.quote,
        author:action.payload.author 
      }
    case FETCH_QUOTE_FAILURE:
    return{
      ...state,
      isLoading:false,error:action.error
    }
    default:
      return state;
  }
};
const store=createStore(quoteReducer,applyMiddleware(thunk));
const colors=["#e0ddd5","#283d70","#2e3546","#c6934b","#703529","#73a99c","#ec795c","#f3be5d","#a9c1b5"]
const colorbg=["#fecc33","#fecc66","#cc9933","#fe9933","#fefe99","#5e3232","#8c925b","#6a9c89","#332c45","#5c2d42"]
class QuoteComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.handleNextQuote=this.handleNextQuote.bind(this)
  };
  componentDidMount(){
    this.props.fetchQuote();
  }
  handleNextQuote(){
    this.props.fetchQuote();
  }
  render(){
    const {quote,author,isLoading,error}=this.props;
    const randombox=colors[Math.floor(Math.random()*colors.length)];
    const randombg=colorbg[Math.floor(Math.random()*colorbg.length)];
    const tweetUrl = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;
    if (isLoading) {
      return<div>Loading...</div>
    }
    if(error){
      return <div>Error: {error.message}</div>
    }
    return (
        <div id="quote-box" style={{ backgroundColor: randombox}}>
          <h2 id="text">{quote}</h2>
          <div id="author">- {author}</div>
          <button id="new-quote" onClick={this.handleNextQuote} style={{ backgroundColor: randombg}}>Next Quote</button>
          <a id='tweet-quote' href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <FaTwitter style={{color:'aliceblue',backgroundColor:randombox,margin:"10px",height:"20px",width:"25px"}}></FaTwitter>
          </a>
        </div>
    );
  }
};
const mapStateToProps=state=>({
  quote:state.quote,
  author:state.author,
  isLoading:state.isLoading,
  error:state.error
});
const mapDispatchToProps={fetchQuote};
const ConnectionComponent=connect(mapStateToProps,mapDispatchToProps)(QuoteComponent);
const container=document.getElementById('root');
const root=createRoot(container)
root.render(
  <Provider store={store}>
    <ConnectionComponent/>
  </Provider>,
);

