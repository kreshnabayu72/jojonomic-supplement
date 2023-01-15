import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";

function UploadXMLPage() {
  const [file, setFile] = useState();
  const [data, setData] = useState({});
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [XMLString, setXMLString] = useState();

  const reader = new FileReader();
  reader.onload = async (e) => {
    setXMLString(e.target.result);
  };

  useEffect(() => {
    if (file) {
      reader.readAsText(file);
      setDataIsLoaded(true);
    } else {
      setDataIsLoaded(false);
    }
  }, [file]);

  useEffect(() => {
    if (XMLString) {
      ParseXML();
    }
  }, [XMLString]);

  const ParseXML = async () => {
    const parser = new XMLParser();
    let jObj = await parser.parse(XMLString);
    jObj.po["po_head"]["po_date"] = new Date(
      jObj.po["po_head"]["po_date"]
    ).getTime();

    setData({ po: jObj.po });
  };

  const SubmitHandler = async () => {
    if (file) {
      setLoading(true);
      await axios.post(
        "https://gateway.jojonomic.com/v1/nocode/api/ims/upload",
        data
      );
      alert("Submitted Data!");
      setLoading(false);
    } else {
      alert("Data not loaded, cant submit!");
      console.log("data not loaded");
    }
  };

  const Loading = () => {
    if (loading) return <h1>Submitting...</h1>;
  };

  const IsDataLoaded = () => {
    if (dataIsLoaded) {
      return <h1>Ready to submit</h1>;
    } else {
      return <h1>No File, Cant Submit</h1>;
    }
  };

  return (
    <div>
      <Loading />
      <IsDataLoaded />

      <input
        type="file"
        name="xml"
        id="xml"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={() => SubmitHandler()}>Submit</button>
    </div>
  );
}

export default UploadXMLPage;
