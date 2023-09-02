import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);

    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews(); 
        // below comment help to counter the empty array that is passed
        // eslint-disable-next-line
    }, [])
 

    // const handlePrevClick = async () => {
    //     setPage(page-1)
    //     updateNews();
    // }

    // const handleNextClick = async () => { 
    //     setPage(page+1)
    //     updateNews()
    // }

    const fetchMoreData = async () => {   
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        // this set page take sometime to load so, manually it is added to the url
        setPage(page+1) 

        let data = await fetch(url);
        let parsedData = await data.json()

        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>

            </>
        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
// export class News extends Component {
//   static defaultProps = {
//     country: 'in',
//     pageSize: 8,
//     category: 'general'
//   }

//   static propTypes = {
//     country: PropTypes.string,
//     pageSize: PropTypes.number,
//     category: PropTypes.string
//   }

//   // Integrating article into this
//   articles = [
//     {
//       "source": {
//         "id": "bbc-sport",
//         "name": "BBC Sport"
//       },
//       "author": null,
//       "title": "'Ashes has been best ever in women's cricket history'",
//       "description": "Captains Heather Knight and Alyssa Healy reflect on an epic Ashes battle that saw Australia retain the trophy at the Ageas Bowl.",
//       "url": "http://www.bbc.co.uk/sport/cricket/66215705",
//       "urlToImage": "https://ichef.bbci.co.uk/live-experience/cps/624/cpsprodpb/FC43/production/_130397546_hk.jpg",
//       "publishedAt": "2023-07-17T05:22:16.3104085Z",
//       "content": "This summer's Ashes has been the \"best series ever in women's cricket history\", says England captain Heather Knight. \r\nEngland have not won the Ashes for a decade, but both sides have played their pa… [+3240 chars]"
//     },
//     {
//       "source": {
//         "id": "espn-cric-info",
//         "name": "ESPN Cric Info"
//       },
//       "author": null,
//       "title": "PCB hands Umar Akmal three-year ban from all cricket | ESPNcricinfo.com",
//       "description": "Penalty after the batsman pleaded guilty to not reporting corrupt approaches | ESPNcricinfo.com",
//       "url": "http://www.espncricinfo.com/story/_/id/29103103/pcb-hands-umar-akmal-three-year-ban-all-cricket",
//       "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1099495_800x450.jpg",
//       "publishedAt": "2020-04-27T11:41:47Z",
//       "content": "Umar Akmal's troubled cricket career has hit its biggest roadblock yet, with the PCB handing him a ban from all representative cricket for three years after he pleaded guilty of failing to report det… [+1506 chars]"
//     },
//     {
//       "source": {
//         "id": "espn-cric-info",
//         "name": "ESPN Cric Info"
//       },
//       "author": null,
//       "title": "What we learned from watching the 1992 World Cup final in full again | ESPNcricinfo.com",
//       "description": "Wides, lbw calls, swing - plenty of things were different in white-ball cricket back then | ESPNcricinfo.com",
//       "url": "http://www.espncricinfo.com/story/_/id/28970907/learned-watching-1992-world-cup-final-full-again",
//       "urlToImage": "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1219926_1296x729.jpg",
//       "publishedAt": "2020-03-30T15:26:05Z",
//       "content": "Last week, we at ESPNcricinfo did something we have been thinking of doing for eight years now: pretend-live ball-by-ball commentary for a classic cricket match. We knew the result, yes, but we tried… [+6823 chars]"
//     }
//   ]

//   capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

//   constructor(props) {
//     super(props);
//     console.log("Hello from constructor")
//     this.state = {
//       articles: this.articles,
//       loading: false,
//       page: 1,
//       // for infinite scroll(by default totalResult is 0)
//       totalResults: 0
//     }
//     document.title = `${this.capitalizeFirstLetter(props.category)} - NewsMonkey`;
//   }

//   async updateNews() {
//     props.setProgress(10);
//     const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${this.state.page}&pageSize=${props.pageSize}`;
//     this.setState({ loading: true });
//     let data = await fetch(url);
//     props.setProgress(30);
//     let parsedData = await data.json()
//     props.setProgress(70);
//     this.setState({
//       articles: parsedData.articles,
//       totalResults: parsedData.totalResults,
//       loading: false,
//     })
//     props.setProgress(100);
//   }

//   // Fetch data using the async/await syntax
//   // Async can wait inside its body to resolve for some of the promises
//   async componentDidMount() {
//     // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=1bb96b91d36c448ca7e31dc10b119a9a&page=1`;
//     // this.setState({loading: true});
//     // // fetch API takes a URL and returns a promise
//     // let data = await fetch(url);
//     // // data as text or JSON
//     // let parsedData = await data.json();
//     // // With the following the above article [] is not needed and can be removed
//     // this.setState({
//     //   articles: parsedData.articles,
//     //   loading: false
//     // })
//     this.updateNews();

//   }

//   handlePrevClick = async () => {
//     // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&&category=${props.category}&apiKey=1bb96b91d36c448ca7e31dc10b119a9a&page=${this.state.page + 1}&pageSize=${props.pageSize} `;
//     // // as the url is hit
//     // this.setState({ loading: true });
//     // let data = await fetch(url);
//     // let parsedData = await data.json();
//     // this.setState({
//     //   page: this.state.page - 1,
//     //   articles: parsedData.articles,
//     //   loading: false
//     // })
//     this.setState({ page: this.state.page - 1 });
//     this.updateNews();
//   }

//   handleNextClick = async () => {
//     // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=1bb96b91d36c448ca7e31dc10b119a9a&page=${this.state.page - 1}&pageSize=${props.pageSize} `;
//     // this.setState({ loading: true });
//     // let data = await fetch(url);
//     // let parsedData = await data.json();

//     // this.setState({
//     //   page: this.state.page + 1,
//     //   articles: parsedData.articles,
//     //   // as the data is loaded loading is false
//     //   loading: false
//     // })
//     this.setState({ page: this.state.page + 1 });
//     this.updateNews();
//   }

//   fetchMoreData = async () => {
//     this.setState({ page: this.state.page + 1 })

//     const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${this.state.page}&pageSize=${props.pageSize}`;
//     let data = await fetch(url);
//     let parsedData = await data.json()
//     this.setState({
//         articles: this.state.articles.concat(parsedData.articles),
//         totalResults: parsedData.totalResults,
//         loading: false,
//     })
// };

//   render() {
//     return (
//       <div>
//         <h2 className="text-center" style={{ margin: '35px 0px' }}>News Monkey Top Headlines - {this.capitalizeFirstLetter(props.category)}</h2>

//         {/* {this.state.loading && <Spinner />} */}

//         <InfiniteScroll
//           dataLength={this.state.articles.length}
//           next={this.fetchMoreData}
//           hasMore={this.state.articles.length !== this.state.totalResults}
//           loader={<Spinner/>}
//         >
//           {/* this container div will solve the horizontal scroll bar */}
//           <div className='container'>
//           <div className='row'>
//             {/* during loading there should be no data in screen */}
//             {/* {!this.state.loading && this.state.articles.map((element) => { */}

//             {this.state.articles.map((element) => {

//               return <div className='col-md-4' key={element.url}>
//                 {/* Sometimes null values in title and description comes so it is cann't be sliced */}
//                 <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 80) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={!element.author ? "unknown" : element.author} date={element.publishedAt} source={element.source.name} />
//               </div>

//             })}
//           </div>
//           </div>
//         </InfiniteScroll>
//         {/* flex property is added later on */}
//         {/* <div className="container d-flex justify-content-between">
//           <button disabled={this.state.page <= 1} type="button" class="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
//           <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} type="button" class="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
//         </div> */}
//       </div>

//     )
//   }
// }

// export default News