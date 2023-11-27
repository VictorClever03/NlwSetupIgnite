import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import './styles/global.css';
import './lib/dayjs';
import { api } from './lib/axios';

navigator.serviceWorker.register('service-worker.js').then(async ServiceWorker => {
  let subscription = await ServiceWorker.pushManager.getSubscription()

  if (!subscription) {
    const publicKeyResponse = await api.get('/push/public-key')
    subscription = await ServiceWorker.pushManager.subscribe({
      userVisibleOnly: true,   
      applicationServerKey: publicKeyResponse.data.publicKey
    })
  }

  // console.log(subscription)
  await api.post('/push/register',{
    subscription, 
  })
})


// window.Notification.requestPermission(permition => {
//   if (permition === 'granted'){
//     new window.Notification('habits',{
//       body:'teste'
//     })
//   }
//   // Local Notification => App fechado X, Scheduling
// })


export function App() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='w-full max-w-5xl px-6 flex flex-col gap-16'>
        <Header />
        <SummaryTable />
      </div>
    </div>

  )
}

