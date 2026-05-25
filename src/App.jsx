import { useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {

  const [Loading, setLoading] =
    useState(false)

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

  // =========================
  // GET DATA
  // =========================

  const Getdata = async () => {

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

      // วนหาในทุก Sheet
      for (const sheetName of sheetNames) {

        try {
          setLoading(true)

          // console.log(
          //   "Searching in:",
          //   sheetName
          // )

          // =========================
          // GET SHEET DATA
          // =========================

          const res = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A:Z?key=${API_KEY}`
          )

          // กัน sheet ว่าง
          const rows =
            res.data.values || []

          // ตัด header
          const clearRows =
            rows.slice(1)

          // console.log(clearRows)

          // =========================
          // FIND JOB NUMBER
          // =========================

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

          // console.log(
          //   "FOUND:",
          //   found
          // )

          // =========================
          // IF FOUND
          // =========================

          if (found) {

            foundData = {

              day:
                found[0] || "",

              name:
                found[1] || "",

              jobREG:
                found[2] || "",

              Status:
                found[3] || "",

              note:
                found[4] || "",

              sheet:
                sheetName
                
            }
            setLoading(false)

            break
          }

        } catch (err) {

          console.log(
            "SHEET ERROR:",
            sheetName
          )

          console.log(
            err.response?.data
          )
          setLoading(false)
        }
      }

      // =========================
      // FOUND DATA
      // =========================

      if (foundData) {

        setCurrentSearch(foundData)

        setResultMessage(
          `พบข้อมูล`
        )

        setResultColor(
          "text-black"
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

      console.log(
        "MAIN ERROR:"
      )

      console.log(
        err.response?.data
      )

      setResultMessage(
        "เกิดข้อผิดพลาด"
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

      <section className='InputSection text-center flex flex-col gap-10 p-10'>

        {/* HEADER */}
        <div className='text-2xl border-2 border-white rounded-xl p-4 bg-black/40'>

          <h1 className='font-bold underline text-green-500'>
            Status Post Checker
          </h1>

          <p>
            กรอกเลขงานเพื่อตรวจสอบสถานะ
          </p>

        </div>

        {/* RESULT MESSAGE */}
        <div
          className={`text-2xl font-bold ${ResultColor}`}
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