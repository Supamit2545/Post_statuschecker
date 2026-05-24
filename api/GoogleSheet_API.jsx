import { React, useState } from 'react'
import axios from 'axios'

export const GoogleSheet_API = () => {
    const Getdata = () =>{
        data = axios.get('https://docs.google.com/spreadsheets/d/1RKsU1RU689kA18wbJe99Z0yJz80xZYVp6TT3QgLsl3Q/edit?gid=0#gid=0')
        .then(()=>{console.log(data)}).catch((err)=>{console.log(err)})
        
    }

    return (
        <div><button className='w-100 h-10 border-red-500 border-2 rounded-2xl bg-red-900 hover:cursor-pointer hover:bg-red-600 transition-all' onClick={()=>{Getdata}}>Test</button></div>
    )
}
