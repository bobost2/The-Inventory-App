import Button from '@mui/material/Button'
import styles from './page.module.css'
import InventoryIcon from '@mui/icons-material/Inventory';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export default function Home() {
  return (
    <main className={styles.mainPage}>
      <InventoryIcon className={styles.inventoryIcon} />
      <h1>The Inventory App</h1>
      <h3>The solution to my and your inventory problems.</h3>
      <div>
        <Button style={{marginRight: "10px"}} color='success' href='/login'
          variant="contained" startIcon={<LoginIcon />}>Login</Button>
        <Button style={{marginLeft: "10px"}} color='success' href='/register'
          variant="contained" startIcon={<PersonAddAlt1Icon />}>Register</Button>
      </div>
    </main>
  )
}
