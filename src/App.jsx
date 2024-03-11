// Filename - App.js

// Importing modules
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { RQicon } from './mysvg'
import { Anchor, Button, Divider, Form, Input, Layout, Space, Table, Typography, notification } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { SearchOutlined, TruckFilled } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import FullPageLoader from "./FullPageLoader";
//const api_url = "http://localhost:5000/";

function App() {
    const [loading, setLoading] = useState(false)
    const contentRef = useRef();
    const scrollToBottom = () => {
            let elem = document.getElementById("mainContainer")
            setTimeout(()=>{
                elem.scroll(0,elem.scrollHeight)
            }, 300)
    };

    const [name, setName] = useState("'My work aims to systematically identify and analyze, the literature on Large language models in software development'");
    const [noOfQuestion, setNoOfQuestions] = useState(2)
    const [researchQuestions, setResearchQuestions] = useState([])
    const [researchQuestionApiResponse, setResearchQuestionApiResponse] = useState()
    const [searchString, setSearchString] = useState('')
    const [start_year, setstartYear] = useState(2023)
    const [end_year, setEndYear] = useState(2020)

    const generateSearchString = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await fetch("/api/generate_search_string", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: name,
                    research_questions: researchQuestions
                })
            });
            const message = await response.json();
            setSearchString(message.search_string.replace(/^\d+\.\s*/, '').replace(/\bAND\b/g, 'OR'))
            setLoading(false)
            scrollToBottom()
            notification.success({
                message:"Search String Generated"
            })
        } catch (e) {
            notification.error({
                message: `internal Server Error`
            })
            setLoading(false)
        }
    }
    const [papersData, setPapersData] = useState()
    const [limitPaper, setLimitPaper] = useState(10)
    const fetchAndSavePapers = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await fetch("/api/search_papers", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search_string: searchString,
                    start_year: start_year,
                    limit: limitPaper
                })
            });
            const message = await response.json();
            if (message) {
                setPapersData(message)
            }
            scrollToBottom()
            setLoading(false)
            notification.success({
                message:"Papers Found"
            })
        } catch (e) {
            console.log("error:", e)
            setLoading(false)
            notification.error({
                message:"Internal Server Error"
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const response = await fetch("/api/generate_research_questions_and_purpose", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: name,
                    num_questions: noOfQuestion
                }),
            });
            const message = await response.json();
            let dataResponse = message.research_questions.research_questions.map((i, index) => ({ ...i, key: index }))
            console.log("response:", dataResponse);
            setResearchQuestionApiResponse(dataResponse)
            let questions = message.research_questions.research_questions.map(i => i.question)
            setResearchQuestions(questions)
            setLoading(false)
            scrollToBottom()
            notification.success({
                message:"Research Questions Generated"
            })
        } catch (error) {
            console.error("Error submitting data:", error);
            setLoading(false)
            notification.error({
                message:"Internal Server Error"
            })
        }
    };
    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            render: (text, record, index) => index + 1, // Renders the row number
          },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 500
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            width: 500
        },
    ];




    const paperColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            render: (text, record, index) => index + 1, // Renders the row number
          },
        { title: 'Title', dataIndex: 'title', key: 'title', width: 200 },
        { title: 'Author', dataIndex: 'creator', key: 'creator', width: 100 },

        { title: 'Publication URL', dataIndex: 'link', key: 'link', width: 400 },
        { title: 'Journal Name', dataIndex: 'publicationName', key: 'publicationName', width: 200 },
        { title: 'DOI', dataIndex: 'doi', key: 'doi', width: 200 },
        { title: 'Paper Type', dataIndex: 'aggregationType', key: 'aggregationType', width: 150 },
        { title: 'Affiliation Country', dataIndex: 'affiliation-country', key: 'affiliation-country', width: 100 },
        { title: 'Affiliation Name', dataIndex: 'affilname', key: 'affilname', width: 200 },
        { title: 'Volume', dataIndex: 'volume', key: 'volume', width: 90 },
        { title: 'Publication Year', dataIndex: 'year', key: 'year', width: 90 },
        { title: 'Open Access', dataIndex: 'openaccess', key: 'openaccess', render: text => text ? 'Yes' : 'No', width: 150 }, // Assuming openaccess is a boolean
    ];

    const [papersFilterData, setPapersFilterData] = useState()
    const fetchAndFilterPapers = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await fetch("/api/filter_papers", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search_string: searchString,
                    papers: papersData
                })
            });
            const message = await response.json();
            console.log("message:", message)
            if (message) {
                setPapersFilterData(message.filtered_papers)
            }
            scrollToBottom()
            setLoading(false)
            notification.success({
                message:"Papers Filtered"
            })
        } catch (e) {
            console.log("error:", e)
            setLoading(false)
            notification.error({
                message:"internal server error"
            })
        }
    }


    const answers = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            render: (text, record, index) => index + 1, // Renders the row number
          },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            width: 280
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
    ];

    const [ansWithQuestions, setAnsWithQuestionsData] = useState()
    const ansWithQuestionsData = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await fetch("/api/answer_question", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questions: researchQuestions,
                    papers_info: papersFilterData
                })
            });
            const message = await response.json();
            console.log("message:", message)
            if (message) {
                setAnsWithQuestionsData(message.answers)
            }
            setLoading(false)
            notification.success({
                message:"Answers Generated"
            })
            scrollToBottom()
        } catch (e) {
            console.log("error:", e)
            setLoading(false)
            notification.error({
                message:"Internal Server Error"
            })
        }
    }
    const [summary, setSummary] = useState()
    const [introSummary, setIntroSummary] = useState()
    const [allSummary, setAllSummary] = useState()
    const generateSummaryAbstract = async (e) =>{
        e.preventDefault()
        setLoading(true)
        try{
            let response = await fetch ("api/generate-summary-abstract", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questions: researchQuestions,
                    objective: name,
                    search_string: searchString
                })
            });
            let message = await response.json()
            setSummary(message.summary_abstract)
            setLoading(false)
            notification.success({
                message:"Summary Abstract Generated"
            })
            scrollToBottom()
        }catch(error) {
            setLoading(false)
            console.log("error:", error)
        }
    }
    const introductionSummary = async (e) =>{
        e.preventDefault()
        setLoading(true)
        try{
            let response = await fetch ("api/generate-introduction-summary", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questions: researchQuestions,
                    objective: name,
                    search_string: searchString,
                    total_papers: papersData,
                    filtered_papers: papersFilterData,
                    answers: ansWithQuestions
                })
            });
            let message = await response.json()
            setIntroSummary(message.introduction_summary)
            setLoading(false)
            notification.success({
                message:"Introduction Summary Generated"
            })
            scrollToBottom()
        }catch(error) {
            setLoading(false)
            console.log("error:", error)
        }
    }

    const [downloadlink, setDownloadLink] = useState()
    const generateAllSummary = async (e) =>{
        e.preventDefault()
        setLoading(true)
        try{
            let response = await fetch ("api/generate-summary-all", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    abstract_summary: summary,
                    intro_summary: introSummary,
                    conclusion_summary: summary
                })
            });if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
              }
              const blob = await response.blob();
              const contentDisposition = response.headers.get('Content-Disposition');
              const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'paper_summary.tex';
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);
              setLoading(false)
        }catch(error) {
            setLoading(false)
            console.log("error:", error)
        }
    }
    useEffect(() => {
        console.log("searchString:", searchString)
    }, [searchString])
    const handleTextareaChange = (event) => {
        const newText = event.target.value;
        const modifiedString = newText.replace(/^Question \d+: /gm, '');
        console.log("modified value",modifiedString.trim());
        // console.log("question value:", event.target.value)
        const newQuestions = modifiedString.split('\n').map((question) => question);
    
        setResearchQuestions(newQuestions);
    };
    const handleSearchStringChange = (event) => {
        if(event.target.value == ""){
            setSearchString(" ")
        }else{
            setSearchString(event.target.value);
        }
    };


    return (
        <Layout>
            {/* paddingLeft:"5px", paddingRight:"5px" */}
            <Header style={{ backgroundColor: "#f3fff3", }} >
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "0px" }}>
                    <div>
                        <RQicon width={"60px"} height={"60px"} />
                    </div>
                    <div style={{ fontSize: "20px", color: "black" }}>
                        <strong >SLR Automation Tool</strong>
                    </div>
                    <div>

                    </div>
                </div>
            </Header>
            <Layout>
                <Content>
                    {loading && <FullPageLoader/>}
                    <div
                    id="mainContainer" 
                    style={{
                        // paddingTop:"150px",
                        lineHeight: "0px",
                        display: "flex",
                        flexDirection: "column",
                        // justifyContent: "center",
                        // alignContent: "center",
                        alignItems: "center",
                        overflowY: "auto",
                        height: "85vh",
                        paddingBottom:"30px"
                    }}
                        ref={contentRef}
                    >
                        <div>
                            <div>
                                {/* <div style={{textAlign:"center"}}><RQicon width={"100px"} height={"100px"} /></div> */}
                                <h5>Hello, I am your Agent, Enter Your Research Objective.</h5>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: "80vw", border: '1px solid #ccc', padding: 15,marginBottom:5, borderRadius: "10px" }}>
                                <Input
                                    placeholder="Ask me anything..."
                                    style={{ flex: 1 }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    placeholder="Number of Questions"
                                    min={1}
                                    max={5}
                                    style={{ marginLeft: 5, width: 120 }}
                                    value={noOfQuestion}
                                    onChange={(e) => setNoOfQuestions(e.target.value)}
                                    type="number" // This ensures only numbers can be entered
                                />
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    style={{ marginLeft: 10 }}
                                    onClick={handleSubmit}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                                {researchQuestionApiResponse &&
                        <div style={{ display: 'flex', alignItems: 'center', width: "80vw", border: '1px solid #ccc', padding: 10, borderRadius: "10px", marginBottom:5 }}>
                            <Space direction="vertical" style={{ width: "100%", padding: "10px 0px" }} >
                                    <Table scroll={{
                                        x: 1200,
                                        y: 500,
                                    }} style={{width:'100%'}} dataSource={researchQuestionApiResponse} columns={columns} pagination={false} />
                                
                            </Space>
                        </div>}

                            {researchQuestions && researchQuestions.length > 0 &&
                        <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', width: "80vw", border: '1px solid #ccc', padding: 10, borderRadius: "10px" }}>
                            <div>
                                <Space align="center" direction="vertical" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Form layout="vertical">
                                        <Form.Item label="List Of Questions">
                                            <TextArea style={{ width: "70vw" }} onChange={handleTextareaChange} value={researchQuestions.map((question, index) => question.length == 0 ?"":`Question ${index + 1}: ${question}`).join('\n')} rows={researchQuestions.length} />
                                        </Form.Item>
                                        <Button type="primary" style={{ width: "auto", float: 'right' }} onClick={generateSearchString}>Create Search String</Button>
                                    </Form>
                                </Space>
                            </div>
                                {searchString && searchString.length > 0 && <div>
                            <div>
                                    <Divider />
                                    <Space align="center" direction="vertical" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form layout="vertical">
                                            <Form.Item label="Search String">
                                                <TextArea onChange={handleSearchStringChange} value={searchString} rows={3} style={{ width: "70vw" }} />
                                            </Form.Item>
                                            {/* <Space.Compact> */}

                                                <Form.Item label="Year" style={{width:"70vw"}}>
                                                    <Input type="number" max={2024} min={2014} value={start_year} onChange={(e) => setstartYear(e.target.value)} />
                                                </Form.Item>
                                                <Form.Item label="No of Papers" style={{width:"70vw"}}>
                                                    <Input type="number" max={15} min={5} value={limitPaper} onChange={(e)=> setLimitPaper(e.target.value)}  placeholder="No Of Papers"/>
                                                </Form.Item>
                                            {/* </Space.Compact> */}
                                            <Button type="primary" style={{ width: "auto", float: 'right' }} onClick={fetchAndSavePapers}>Fetch Papers</Button>
                                        </Form>
                                    </Space>
                                </div>
                                
                            </div>}
                            {papersData &&
                                <><Divider />
                                    <Space direction="vertical" style={{ width: "100%", padding: "10px 0px" }} >
                                        <Table scroll={{
                                            x: 1500,
                                            y: 450,
                                        }} style={{ width: "100%" }} dataSource={papersData} columns={paperColumns} pagination={false} />
                                        <Button type="primary" style={{ float: "right", marginTop: "10px" }} onClick={fetchAndFilterPapers}>Filter with title</Button>
                                    </Space></>
                            }

                            {papersFilterData && <Space direction="vertical" style={{ width: "100%", padding: "10px 0px" }} >
                                <Table scroll={{
                                    x: 1500,
                                    y: 450,
                                }} dataSource={papersFilterData} columns={paperColumns} pagination={false} />
                                <Button type="primary" style={{ float: "right", marginTop: "10px" }} onClick={ansWithQuestionsData}>Find Answers of Each Question </Button>
                            </Space>}
                            {ansWithQuestions &&
                                <Space direction="vertical" style={{ width: "100%", padding: "10px 0px" }}>
                                    <Table dataSource={ansWithQuestions} columns={answers} pagination={false} />
                                    <Button type="primary" style={{float:"right", marginTop:"10px"}} onClick={generateSummaryAbstract}>Generate Summary Abstract </Button>
                                </Space>
                            }
                            {summary && summary.length >0 && <><Divider />
                                    <Space align="center" direction="vertical" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form layout="vertical">
                                            <Form.Item label="Summary Abstract">
                                                <TextArea onChange={(e)=> setSummary(e.target.value)} value={summary} rows={7} style={{ width: "70vw" }} />
                                            </Form.Item>
                                            <Button type="primary" style={{ width: "auto", float: 'right' }} onClick={introductionSummary}>Introduction Summary</Button>
                                        </Form>
                                    </Space>
                            </>}
                            {introSummary && introSummary.length >0 && <><Divider />
                                    <Space align="center" direction="vertical" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form layout="vertical">
                                            <Form.Item label="Introduction Summary">
                                                <TextArea onChange={(e)=> setIntroSummary(e.target.value)} value={introSummary} rows={7} style={{ width: "70vw" }} />
                                            </Form.Item>
                                            <Button type="primary" style={{ width: "auto", float: 'right' }} onClick={generateAllSummary}>Create Paper Summary</Button>
                                            {downloadlink && downloadlink.length>0 && <a href={downloadlink} >download file</a> }
                                        </Form>
                                    </Space>
                            </>}
                        </div>}
                    </div>

                </Content>
            </Layout>
            <Footer className="footerFixed">
                   <div style={{float:"right", lineHeight:0}}>
                   <p>&copy; {new Date().getFullYear()} SLR Automation Tool. All rights reserved.  </p>
                    </div>     
            </Footer>
        </Layout>
    );
}

export default App;