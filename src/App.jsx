import { useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {

  const [Input_from_user, setInput_from_user] =
    useState('')

  const [CurrentSearch, setCurrentSearch] =
    useState({
      name: "",
      jobREG: "",
      Status: "",
      note: ""
    })

  const [ResultMessage, setResultMessage] =
    useState("")

  const [ResultColor, setResultColor] =
    useState("text-white")

  const [ShowPopup, setShowPopup] = useState(false)
  const Getdata = async () => {

    try {

      // ดึงรายชื่อทุก Sheet
      const meta = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1RKsU1RU689kA18wbJe99Z0yJz80xZYVp6TT3QgLsl3Q?key=AIzaSyDErYLbasUPZVkpNaedVvYsRk5IlXLk9W0'
      )

      // เอาชื่อ Sheet ออกมา
      const sheetNames =
        meta.data.sheets.map(
          sheet => sheet.properties.title
        )

      let foundData = null

      // วนหาทุก Sheet
      for (const sheetName of sheetNames) {

        const res = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/1RKsU1RU689kA18wbJe99Z0yJz80xZYVp6TT3QgLsl3Q/values/${sheetName}?key=AIzaSyDErYLbasUPZVkpNaedVvYsRk5IlXLk9W0`
        )

        const rows =
          res.data.values.slice(1)

        // หาเลขงาน
        const found = rows.find(
          row => row[1] === Input_from_user
        )

        // ถ้าเจอ
        if (found) {

          foundData = {
            name: found[0] || "",
            jobREG: found[1] || "",
            Status: found[2] || "",
            note: found[3] || "",
            sheet: sheetName
          }

          break
        }
      }

      // ถ้าเจอข้อมูล
      if (foundData) {

        setCurrentSearch(foundData)

        setResultMessage(
          `พบข้อมูลใน ${foundData.sheet}`
        )

        setResultColor("text-green-500")

        setShowPopup(true)

      } else {

        // ไม่เจอ
        setCurrentSearch({
          name: "",
          jobREG: "",
          Status: "",
          note: "",
          sheet: ""
        })

        setResultMessage(
          "ไม่พบข้อมูล"
        )

        setResultColor("text-red-500")

        setShowPopup(false)
      }

    } catch (err) {

      console.log(err)

      setResultMessage(
        "เกิดข้อผิดพลาด"
      )

      setResultColor(
        "text-red-500"
      )

      setShowPopup(false)
    }
  }

  return (

    <div className="app min-h-screen bg-black text-white">

      <section className='InputSection text-center flex flex-col gap-10 p-10'>

        {/* Header */}
        <div className='text-2xl border-2 border-white rounded-xl p-4 bg-black/40'>

          <h1 className='font-bold underline text-green-500'>
            Status Post Checker
          </h1>

          <p>
            กรอกข้อมูลเลขงานที่ต้องการตรวจสอบในช่องด้านล่างได้เลยครับ
          </p>

        </div>

        {/* Result Message */}
        <div
          id='Result-Message'
          className={`text-2xl font-bold ${ResultColor}`}
        >
          {ResultMessage}
        </div>

        {/* Result Popup */}
        <div className={`${ShowPopup == true ? "flex" : 'hidden'} fixed inset-0 bg-black/70 items-center justify-center z-50`}>

          <div className='w-9/12 max-w-xl bg-white text-black rounded-xl p-5 space-y-4 relative'>
            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              ชื่อผู้แจ้ง
            </p>

            <p className='h- border-black border-2 text-2xl bg-gray-700 text-green-500 flex items-center justify-center'>
              {CurrentSearch.name || "-"}
            </p>

            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              เลขงาน
            </p>

            <p className='h-10 border-black border-2 text-2xl bg-gray-700 text-yellow-400 flex items-center justify-center'>
              {CurrentSearch.jobREG || "-"}
            </p>

            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              สถานะ
            </p>

            <p id='StatusText' className={`h-10 border-black border-2 text-2xl bg-gray-500 ${CurrentSearch.Status == 'ติดปัญหา' ? "text-red-500" : 'text-green-500'} flex items-center justify-center`}>
              {CurrentSearch.Status || "-"}
            </p>

            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              หมายเหตุ
            </p>

            <p className='min-h-10 border-black border-2 text-2xl bg-white text-black font-bold flex items-center justify-center py-2'>
              {CurrentSearch.note || "-"}
            </p>
            <button className='border-2 border-black rounded-2xl px-5 py-2 bg-red-900 text-white hover:cursor-pointer hover:bg-red-500 transition-all' onClick={() => setShowPopup(false)}>ปิดหน้าต่าง</button>
          </div>
        </div>

        {/* Input */}
        <div className='Insert-Field'>

          <input
            className='Input-Regjob w-9/12 border-2 border-white rounded-sm px-5 py-3 bg-black/40 text-center'
            type="text"
            placeholder='Ex. REG260524-001'
            value={Input_from_user}
            onChange={(e) => {
              setInput_from_user(e.target.value)
            }}
          />

        </div>

        {/* Submit */}
        <div className='Submit_Btn'>

          <button
            className='w-100 h-10 border-red-500 border-2 rounded-2xl bg-red-900 hover:cursor-pointer hover:bg-red-600 transition-all px-10'
            onClick={Getdata}
          >
            ตรวจสอบสถานะ
          </button>

        </div>

      </section>

    </div>
  )
}

export default App