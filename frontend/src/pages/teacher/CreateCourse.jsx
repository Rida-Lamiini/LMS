import React from 'react'

export  function CreateCourse() {
  return (
    <div className='max-w-5xl mx-auto flex'>
        <div>
            <h1 className='text-2xl'>Name your course</h1>
            <p className='text-sm text-slate-600'>What you would like to name your course? Don't worry , you can change this later.</p>
            <form className='space-y-8 mt-8' >
                <label htmlFor="title" className='block text-sm font-medium text-gray-900 '>Course Title</label>
                <input type="text" name='title' placeholder='e.g. Advanced web devolopment '
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ' />



                <div className="flex items-center gap-x-2">
                    <button className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>cancel</button>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>submit</button>
                </div>


                
                
            </form>
        </div>
    </div>
  )
}
