using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Main
{
    class Program
    {
        public const string textFilePath = "E:\\Projects\\3DGraphing\\icoSphere2.obj";

        static void Main(string[] args)
        {
            int extIndex = textFilePath.LastIndexOf('.');
            string outputFile = textFilePath.Substring(0, extIndex) + ".json";

            StreamReader sr = new StreamReader(textFilePath);
            //StreamWriter sw = new StreamWriter(outputFile);


            List<string> vertices = new List<string>();
            List<string> faces = new List<string>();

            string line;
            vertices.Add("var vertices = [");
            while ((line = sr.ReadLine()) != null)
            {
                string[] pieces = line.Split(' ');
                if (pieces.Length <= 1) continue;

                if (pieces[0] == "f")
                {
                    int v0 = Int32.Parse(pieces[1]) - 1;
                    int v1 = Int32.Parse(pieces[2]) - 1;
                    int v2 = Int32.Parse(pieces[3]) - 1;
                    if (pieces.Length == 5)
                    {
                        int v3 = Int32.Parse(pieces[4]) - 1;
                        faces.Add(String.Format("{0}, {1}, {2}, {3},", v0, v1, v2, v3));
                    }
                    else
                    {
                        faces.Add(String.Format("{0}, {1}, {2},", v0, v1, v2));
                    }
                }
                else if (pieces[0] == "v")
                {
                    vertices.Add(String.Format("{{x: {0}, y: {1}, z: {2}}},", pieces[1], pieces[2], pieces[3]));
                }
            }

            vertices.Add("];"); 
            
            vertices.Add("var indices = [");
            vertices.AddRange(faces);
            vertices.Add("];");

            File.WriteAllLines(outputFile, vertices.ToArray());


            Console.WriteLine(outputFile);
           // sw.Close();
            sr.Close();
            Console.ReadKey();
        }
    }
}
