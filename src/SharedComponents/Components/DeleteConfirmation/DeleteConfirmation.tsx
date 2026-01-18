
import nodata from '../../../assets/images/nodata.png'
   


type DeleteConfirmationProps = {
  deleteItem: string;
  name: string;
};





export default function DeleteConfirmation({deleteItem ,name}:DeleteConfirmationProps) {
  return (
    <div className='text-center p-3 m-5'>
      <img src={nodata}></img>
      <h4>Delete {deleteItem ?? "this item"}{name}</h4>
    <p>
  Are you sure you want to delete {deleteItem ?? "this item"}? If you are sure,
  just click on Delete.
</p>
    </div>
  )
}