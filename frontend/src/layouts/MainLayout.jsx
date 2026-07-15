import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


function MainLayout({children}){

return (

<div>

<Header/>

<div className="row">

<div className="col-md-2">
<Sidebar/>
</div>


<div className="col-md-10 p-4">

{children}

</div>


</div>


</div>

)

}

export default MainLayout
