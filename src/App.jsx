import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {

  const [Loading, setLoading] =
    useState(false)

  const PostSend_Date = "ยังไม่กำหนดรอบส่ง"
  const [Monthselect, setMonthselect] = useState()
  // console.log(Monthselect)
  const [Input_from_user, setInput_from_user] =
    useState('')

  const [CurrentSearch, setCurrentSearch] =
    useState({
      day: "",
      name: "",
      jobREG: "",
      Status: "",
      note: "",
      sheet: ""
    })

  const [ResultMessage, setResultMessage] =
    useState("")

  const [ResultColor, setResultColor] =
    useState("text-white")

  const [ShowPopup, setShowPopup] =
    useState(false)

  // =========================
  // GOOGLE CONFIG
  // =========================

  const API_KEY =
    "AIzaSyCXVqsGb5HSs5SdnOHYx5jvjXi3iHCyj2A"

  const SPREADSHEET_ID =
    "1iDwG8zPOv0vri75xHKuVIxEfaFbd0uqa-RZqvRt0TB8"
  const YearSearch = ""
  const MonthSearch = ""
  // =========================
  // GET DATA
  // =========================

  // const TestgetData = async () => {
  //   const res = await axios.get(
  //     `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${Monthselect}?key=${API_KEY}`
  //   ).then(res => { console.log(res) })

  // }

  const Getdata = async () => {
    setLoading(true)
    try {

      // ดึง metadata ของ spreadsheet
      const meta = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
      )

      // เอาเฉพาะ GRID SHEET
      const sheetNames =
        meta.data.sheets

          .filter(
            sheet =>
              sheet.properties.sheetType
              === "GRID"
          )

          .map(
            sheet =>
              sheet.properties.title
          )

      // console.log(
      //   "ALL SHEETS:",
      //   sheetNames
      // )

      let foundData = null


      const range =
        `'${Monthselect}'!A:Z`

      const res = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
      )

      const rows =
        res.data.values || []

      const clearRows =
        rows.slice(1)

      const found =
        clearRows.find(

          row =>

            row[2]
              ?.toString()
              ?.trim()
              ?.toUpperCase()

            ===

            Input_from_user
              ?.toString()
              ?.trim()
              ?.toUpperCase()
        )
      foundData = (
        {
          day: "",
          name: found[1],
          jobREG: found[2],
          Status: found[4],
          note: found[5],
          sheet: ""
        }
      )
      // console.log(found)

      // =========================
      // FOUND DATA
      // =========================

      if (Input_from_user && foundData) {

        setCurrentSearch(foundData)

        setResultMessage(
          `พบข้อมูล`
        )

        setResultColor(
          "text-white"
        )
        setLoading(false)
        setShowPopup(true)

      } else {

        // =========================
        // NOT FOUND
        // =========================

        setCurrentSearch({

          day: "",

          name: "",

          jobREG: "",

          Status: "",

          note: "",

          sheet: ""
        })

        setResultMessage(
          "ไม่พบข้อมูล"
        )

        setResultColor(
          "text-red-500"
        )
        setLoading(false)
        setShowPopup(false)
      }

    } catch (err) {

      // console.log(
      //   "MAIN ERROR:"
      // )

      // console.log(
      //   err.response?.data
      // )

      setResultMessage(
        "ไม่พบข้อมูล"
      )

      setResultColor(
        "text-red-500"
      )
      setLoading(false)
      setShowPopup(false)
    }
  }

  return (

    <div className="app min-h-screen bg-black text-white">

      <section className='InputSection text-center flex flex-col gap-4 p-10'>

        {/* HEADER */}
        <div className='text-2xl border-2 border-white rounded-xl p-4 bg-black/40'>

          <h1 className='font-bold underline text-green-500'>
            Status Post Checker
          </h1>

          <p>
            กรอกเลขงานเพื่อตรวจสอบสถานะ
          </p>
          <h6 className='font-bold'>รอบส่งรอบต่อไป : {PostSend_Date}</h6>
          <p className='underline '>ระบบสามารถตรวจสอบได้สําหรับเอกสารที่ส่ง
          เข้ามาตั้งแต่วันที่ {<p className='w-1/7 mx-auto bg-green-500 font-bold font-mono'>01/05/2026</p>} เป็นต้นไป เอกสารที่ส่งก่อนวันดังกล่าว จะยังไม่สามารถ
          ตรวจสอบสถานะได้ค่ะ
        </p>
        </div>

        {/* RESULT MESSAGE */}
        <div
          className={`mx-auto text-2xl font-bold border-2 bg-black/70 ${ResultColor}`}
        >
          {ResultMessage}
        </div>

        {/* POPUP */}
        <div
          className={`
            ${ShowPopup ? "flex" : "hidden"}
            fixed
            inset-0
            bg-black/70
            items-center
            justify-center
            z-50
          `}
        >

          <div
            className='
              w-9/12
              max-w-xl
              bg-white
              text-black
              rounded-xl
              p-5
              space-y-4
              relative
            '
          >
            {/* NAME */}
            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              ชื่อผู้แจ้ง
            </p>

            <p className='border-black border-2 text-2xl bg-gray-700 text-green-500 flex items-center justify-center py-2'>
              {CurrentSearch.name || "-"}
            </p>

            {/* JOB NUMBER */}
            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              เลขงาน
            </p>

            <p className='border-black border-2 text-2xl bg-gray-700 text-yellow-400 flex items-center justify-center py-2'>
              {CurrentSearch.jobREG || "-"}
            </p>

            {/* STATUS */}
            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              สถานะ
            </p>

            <p
              className={`
                border-black
                border-2
                text-2xl
                bg-gray-700
                text-white
                flex
                items-center
                justify-center
                py-2
              `}
            >
              {CurrentSearch.Status || "-"}
            </p>

            {/* NOTE */}
            <p className='border-2 font-bold rounded-2xl bg-blue-500 text-white text-center'>
              หมายเหตุ
            </p>

            <p className='min-h-10 border-black border-2 text-2xl bg-white text-black font-bold flex items-center justify-center py-2'>
              {CurrentSearch.note || "-"}
            </p>
            {/* CLOSE */}
            <button
              className='
                text-white
                bg-red-600
                px-10
                py-3
                border-2
                border-black
                rounded-lg
                hover:bg-red-500
                hover:cursor-pointer
              '
              onClick={() =>
                setShowPopup(false)
              }
            >
              ปิดหน้าต่าง
            </button>

          </div>
        </div>

        {/* INPUT */}
        <div className='Insert-Field'>

          <input
            className='
              w-9/12
              border-2
              border-white
              rounded-sm
              px-5
              py-3
              bg-black/70
              text-center
            '
            type="text"
            placeholder='Ex. Kapostjob-001'
            value={Input_from_user}
            onChange={(e) => {

              setInput_from_user(
                e.target.value
              )
            }}
          />

        </div>
        {/* MonthSelector */}
        <div className='flex flex-col center space-y-4'>
          <p className='underline text-white font-bold text-2xl'>กรุณาเลือกเดือนที่ค้นหา</p>
          <select className='mx-auto w-3/9 border-2 bg-black/70 text-xl px-2 py-1' name="" id="Monthselect" onChange={(e) => { setMonthselect(e.target.value) }}>
            <option value="JANUARY2026">มกราคม</option>
            <option value="FEBRUARY2026">กุมภาพันธ์</option>
            <option value="MARCH2026">มีนาคม</option>
            <option value="APIRIL2026">เมษายน</option>
            <option value="MAY2026">พฤษภาคม</option>
            <option value="JUNE2026">มิถุนายน</option>
            <option value="JULY2026">กรกฎาคม</option>
            <option value="AUGUST2026">สิงหาคม</option>
            <option value="SEPTEMBER2026">กันยายน</option>
            <option value="OCTOBER2026">ตุลาคม</option>
            <option value="NOVEMBER2026">พฤศจิกายน</option>
            <option value="DECEMBER2026">ธันวาคม</option>
          </select>
        </div>
        {/* BUTTON */}
        <div className='Submit_Btn'>

          <button
            className='
              w-9/12
              h-10
              border-green-500
              border-2
              rounded-2xl
              bg-green-900
              hover:cursor-pointer
              hover:bg-green-600
              transition-all
              px-10
            '
            onClick={Getdata}
          >
            ตรวจสอบสถานะ
          </button>
          {/* <button
            className='
              w-9/12
              h-10
              border-green-500
              border-2
              rounded-2xl
              bg-green-900
              hover:cursor-pointer
              hover:bg-green-600
              transition-all
              px-10
            '
            onClick={TestgetData}
          >
            Test
          </button> */}
        </div>
        <div className='absolute bottom-0 left-0 border-2 bg-gray-700 px-2 py-1 rounded-xl'>
          <p>เว็บไซต์นี้จัดเพื่อความสะดวกสบายในการตรวจสอบสถานะของเอกสารในบริษัทโดยไม่แสวงหาผลกำไรและมีการเรียกเก็บเงินใดทั้งสิ้น</p>
          <p>เว็บไซต์นี้เป็นเพียงตัว Demo เท่านั้น</p>
        </div>

      </section>
      {/* LOADING */}
      {
        Loading && (

          <div
            className='
        fixed
        inset-0
        bg-black/80
        flex
        items-center
        justify-center
        z-[999]
      '
          >

            <div
              className='
          flex
          flex-col
          items-center
          gap-5
        '
            >

              {/* Spinner */}
              <div
                className='
            w-20
            h-20
            border-4
            border-white
            border-t-green-500
            rounded-full
            animate-spin
          '
              />

              <p
                className='
            text-2xl
            text-green-400
            font-bold
          '
              >
                กำลังค้นหาข้อมูล...
              </p>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default App