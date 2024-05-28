import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="fiex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center"> 
            <h2 className="text-2xl font-serif text-center">Ready to get started?</h2>
            <p className="text-center">Get in touch or create an account.</p>
            <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none" size='md'>Get in touch</Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://www.wpbeginner.com/wp-content/uploads/2016/11/tools-to-create-better-images-for-your-blog-posts-og.png"/>
        </div>
    </div>
  )
}
