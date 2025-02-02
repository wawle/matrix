export const postman = {
  template: (name: string, props: any) => {
    return `

        
        export default async function Page() {
          const response = await fetch('/postman-link.txt');
          const link = await response.text();
        
          return (
            <div>
               <h1>Postman Collection</h1>
      <iframe
        src={postmanLink}
        width="100%"
        height="600px"
        frameBorder="0"
        title="Postman Collection"
      ></iframe>
            </div>
          )
        }
            `;
  },
};
