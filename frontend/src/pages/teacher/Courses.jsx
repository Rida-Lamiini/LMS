import React from 'react'
import { Link  ,Outlet} from 'react-router-dom'

export  function Courses() {
  return (
    <div>
        <Link to="/admin/create">
        <button className='primary'>create</button>


        </Link>
        <Outlet/>

    </div>

  )
}
