const YouthMembers = {

async init(){
    await this.render()
},

async render(){

const container =
document.getElementById("membersList")

if(!container) return

const {data:members} =
await supabaseClient
.from("youth_members")
.select("*")
.order("created_at",{ascending:false})

container.innerHTML=""

members.forEach(m=>{

const div=document.createElement("div")

div.className="bg-white p-4 rounded shadow mb-2"

div.innerHTML=`
<strong>${m.nom}</strong>
<p>${m.email}</p>

<button onclick="YouthMembers.remove(${m.id})"
class="bg-red-600 text-white px-2 py-1 rounded">
Supprimer
</button>
`

container.appendChild(div)

})

},

async remove(id){

if(!confirm("Supprimer ce membre ?")) return

await supabaseClient
.from("youth_members")
.delete()
.eq("id",id)

this.render()

}

}