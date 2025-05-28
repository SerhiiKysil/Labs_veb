import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import OrganizationSelector from "./OrganizationSelector";
type StepOneProps = {
  formData: {
    projectName: string;
    organization: {
      id: number;
      name: string;
    };
    projectDescription: string;
    registrationLink: string;
    registrationDeadline: string;
    privateOpp: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleEditorChange: (content: string) => void;
  organizations: Array<{ id: number; name: string }>;
  handleOrganizationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  dateErrors: {
    registrationDeadline: string;
  };
  nextStep: () => void;
};

const StepOne: React.FC<StepOneProps> = ({
  formData,
  handleChange,
  handleEditorChange,
  organizations,
  handleOrganizationChange,
  dateErrors,
  nextStep
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  console.log("StepOne component rendered with formData:", formData);
  console.log("StepOne component rendered with organizations:", organizations);
  const handleOrgSelect = (orgId: number) => {
    const selectedOrg = organizations.find(org => org.id === orgId);    
    const event = {
      target: {
        value: orgId.toString()
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    handleOrganizationChange(event);
    console.log("Selected organization:", selectedOrg);
  };
  return (
<div className="max-w-3xl mx-auto px-6">

      {/* Event Name */}
      <div className="relative w-full mb-8">
        <div className="flex flex-col w-full">
          <input
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
            className="text-4xl font-bold text-[#0B1F51] bg-transparent w-full border-2 border-gray-100 rounded-lg p-2"
            placeholder="Назва події"
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.projectName.length}/100 символів (мінімум 3)
          </div>
        </div>
      </div>

      {/* Organization */}
      <OrganizationSelector 
      organizations={organizations}
      value={formData.organization.id}
      onChange={handleOrgSelect}
    />
{/* Private Opportunity Toggle */}
<div className="mb-6">
  <label className="flex items-center space-x-2 text-[#0B1F51] font-semibold cursor-pointer">
    <span>Приватна подія</span>
    <div className="relative">
      <input
        type="checkbox"
        name="privateOpp"
        checked={formData.privateOpp}
        onChange={(e) => {
          // Use the actual event object from the checkbox
          // but handle it directly here instead of passing a synthetic event
          const isChecked = e.target.checked;
          
          // Call handleChange with properly typed event
          handleChange({
            ...e, // Spread the original event properties
            target: {
              ...e.target, // Keep original target properties
              name: 'privateOpp',
              value: isChecked,
            }
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }}
        className="sr-only"
      />
      <div
        className={`w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
          formData.privateOpp ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
            formData.privateOpp ? 'transform translate-x-6' : ''
          }`}
        />
      </div>
    </div>
  </label>
  <p className="text-sm text-gray-500 mt-1">
    Приватні події доступні тільки для тих хто має відповідне посилання і не відображаються у відкритому доступі. Посилання буде надано після успішного створення події.
  </p>
</div>




      {/* Description */}
      <div className="mb-8">
  <label className="block text-[#0B1F51] font-semibold mb-2">
    Опис заходу
  </label>
  <Editor
    apiKey="e341gtvb62o7cikhir9jj2kip5ln1x7z1h8hjgw4vaovi9v8"
    onInit={(_evt, editor) => {
      editorRef.current = editor;
      
      // Add character limit validation
      editor.on('input', () => {
        const content = editor.getContent({ format: 'text' });
        const characterCount = content.length;
        const maxCharacters = 10000;
        
        if (characterCount > maxCharacters) {
          // Truncate content if it exceeds the limit
          editor.setContent(content.substr(0, maxCharacters));
        }
        
        // Update character count display
        const percentageUsed = Math.round((characterCount / maxCharacters) * 100);
        const characterCountElement = document.getElementById('character-count');
        
        if (characterCountElement) {
          characterCountElement.textContent = `${percentageUsed}%`;
          
          // Add color coding for usage
          if (percentageUsed < 50) {
            characterCountElement.className = 'text-green-500';
          } else if (percentageUsed < 80) {
            characterCountElement.className = 'text-yellow-500';
          } else {
            characterCountElement.className = 'text-red-500';
          }
        }
      });
    }}
    value={formData.projectDescription}
    onEditorChange={handleEditorChange}
    init={{
      height: 300,
      menubar: false,
      plugins: [
        "lists",
        "link",
        "image", 
        "preview",
        "wordcount",
        "emoticons",
      ],
      toolbar: `undo redo | bold italic forecolor backcolor | 
          fontsize | alignleft aligncenter alignright | 
          bullist numlist outdent indent`,
      content_style:
        "body { font-family:Montserrat,sans-serif; font-size:14px }",
    }}
  />
<div className="text-right mt-2 text-sm">
  <span style={{ color: "grey" }}>Використано доступного об&apos;єму: </span>
  <span id="character-count" className="font-bold">0%</span>
</div>

</div>

      {/* Registration Link */}
      <div className="mb-6">
        <label className="block text-[#0B1F51] font-semibold mb-2">
          Посилання на реєстрацію
        </label>
        <input
          name="registrationLink"
          value={formData.registrationLink}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={256}
          className="w-full p-3 border-2 border-gray-300 text-gray-900 rounded-lg"
          placeholder="Посилання на реєстрацію"
        />
        <div className="text-sm text-gray-500 mt-1">
            {formData.registrationLink.length}/256 символів
          </div>
      </div>

{/* Registration Deadline */}
<div className="mb-6">
  <label className="block text-[#0B1F51] font-semibold mb-2">
    Дедлайн реєстрації
  </label>
  <input
    type="datetime-local"
    name="registrationDeadline"
    value={formData.registrationDeadline || new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .slice(0, 16)}
    onChange={handleChange}
    required
    className={`w-full p-3 border-2 ${
      dateErrors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
    } text-gray-900 rounded-lg`}
  />
  {dateErrors.registrationDeadline && (
    <div className="text-red-500 text-sm mt-1">
      {dateErrors.registrationDeadline}
    </div>
  )}
</div>



      {/* Next Step Info */}
      <div className="bg-[#F0F7FF] p-6 rounded-xl mb-8">
        <div className="text-[#0B1F51] font-medium">
          <p>На наступному кроці ви зможете додати:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Дату та час події</li>
            <li>Місце проведення</li>
            <li>Банер події</li>
            <li>Тип участі та вартість</li>
          </ul>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="py-3 px-8 bg-[#0B1F51] hover:bg-blue-900 text-white font-semibold rounded-lg transition-all"
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default StepOne;