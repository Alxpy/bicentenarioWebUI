import  MainLayout  from '@/templates/MainLayout'

import {First_section} from './sections'
import Second_section from './sections/second/Second_section'

const Home = () => {

  return (

    <MainLayout>
      <div className="text-black">
        <First_section />
        <Second_section />
      </div>
    </MainLayout>
  )
}

export default Home
