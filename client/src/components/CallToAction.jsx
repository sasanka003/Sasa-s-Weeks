import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col"> 
            <h2 className="text-2xl text-center">Ready to get started?</h2>
            <p className="text-center text-gray-500">Get in touch or create better images for your blog.</p>
            <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">Get in touch</Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://www.wpbeginner.com/wp-content/uploads/2016/11/tools-to-create-better-images-for-your-blog-posts-og.png"/>
        </div>
    </div>
  )
}