import React from 'react';


export const columns = [
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


export const paperColumns = (papersFilterData, handleCheckboxChange) => [
  {
      width: 65,
      title: 'Filter',
      dataIndex: 'checkbox',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={papersFilterData.includes(record)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
  },
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


// export const paperColumns= (papersFilterData, handleCheckboxChange) => [
//     {
//         width:65,
//         title: 'Filter',
//         dataIndex: 'checkbox',
//         render: (_, record) => (
//           <input
//             type="checkbox"
//             checked={papersFilterData.includes(record)}
//             onChange={() => handleCheckboxChange(record)}
//           />
//         ),
//     },
//     {
//         title: 'No',
//         dataIndex: 'index',
//         key: 'index',
//         width: 80,
//         render: (text, record, index) => index + 1, // Renders the row number
//       },
//     { title: 'Title', dataIndex: 'title', key: 'title', width: 200 },
//     { title: 'Author', dataIndex: 'creator', key: 'creator', width: 100 },

//     { title: 'Publication URL', dataIndex: 'link', key: 'link', width: 400 },
//     { title: 'Journal Name', dataIndex: 'publicationName', key: 'publicationName', width: 200 },
//     { title: 'DOI', dataIndex: 'doi', key: 'doi', width: 200 },
//     { title: 'Paper Type', dataIndex: 'aggregationType', key: 'aggregationType', width: 150 },
//     { title: 'Affiliation Country', dataIndex: 'affiliation-country', key: 'affiliation-country', width: 100 },
//     { title: 'Affiliation Name', dataIndex: 'affilname', key: 'affilname', width: 200 },
//     { title: 'Volume', dataIndex: 'volume', key: 'volume', width: 90 },
//     { title: 'Publication Year', dataIndex: 'year', key: 'year', width: 90 },
//     { title: 'Open Access', dataIndex: 'openaccess', key: 'openaccess', render: text => text ? 'Yes' : 'No', width: 150 }, // Assuming openaccess is a boolean
// ];

export const filterColumns = [
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

export const answers = [
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