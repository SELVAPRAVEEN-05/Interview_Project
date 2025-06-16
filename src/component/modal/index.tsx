"use client";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, cn } from "@heroui/react"; // Importing necessary components from the @heroui/react library

// Defining the interface for the Modal component props
interface Modelcontenttype {
  id?: string; // Optional ID for the modal
  ModalContents?: React.ReactNode; // Content to be displayed inside the modal
  isopen?: boolean; // Boolean to control the modal's open state
  onClose?: () => void; // Function to handle the modal's close event
  hideCloseButton?: boolean; // Boolean for control the CLOSE ICON
  ModalFooterContent?: React.ReactNode; // Content to be displayed the modal footer
  footerStyles?: string; // styles for the Footer component
  bodyClassName?: string; // styles for the Footer component
  modalClassName?: string; // styles for the Modal component
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  width?: string;
  height?: string;
}

// Modal component definition
export const Modals = ({
  id,
  ModalContents,
  isopen,
  onClose,
  hideCloseButton = false,
  ModalFooterContent,
  footerStyles,
  bodyClassName,
  modalClassName,
  size = "sm",
  width = "auto",
  height = "auto",
}: Modelcontenttype) => {
  return (
    <Modal
      id={id} // Assigning the optional ID to the modal
      placement="center" // Placing the modal at the center of the screen
      isOpen={isopen} // Controlling the modal's open/close state
      onClose={onClose} // Assigning the onClose function
      className={cn(
        `max-w-[${width}] w-[${width}] max-h-[${height}] h-[${height}]`,
        "rounded-2xl",
        modalClassName
      )} // Additional classes (empty by default)
      hideCloseButton={hideCloseButton} // Hiding the close button
      size={size} // Setting the modal size to "small"
      radius="lg" // Applying large border-radius to the modal
      classNames={{
        body: cn("p-4 pb-2", bodyClassName), // Adding padding to the modal body
        footer: footerStyles,
      }}
    >
      <ModalContent>
        <ModalBody className={cn(bodyClassName)}>
          {ModalContents} {/* Rendering the passed content inside the modal */}
        </ModalBody>
        {ModalFooterContent && (
          <ModalFooter className="mb-2">{ModalFooterContent}</ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
