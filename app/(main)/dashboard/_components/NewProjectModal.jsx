"use client";
import React, { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import usePlanAccess from "@/hooks/use-plan-access";
import { Badge } from "@/components/ui/badge";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CrownIcon, ImagesIcon, Loader2Icon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpgradeModal } from "./UpgradeModal";

function NewProjectModal({ isOpen, onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  const onHandleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
    setIsUploading(false);
    onClose();
  };
  const { data: projects } = useConvexQuery(api.project.getUserProjects);
  const { mutate: createProject } = useConvexMutation(api.project.create);
  const currentProjectCount = projects ? projects.length : 0;
  const { isFree, canCreateProject } = usePlanAccess();
  const canCreate = canCreateProject(currentProjectCount);
  const onDrop = (acceptedFiles) => {
    console.log("Accepted files:", acceptedFiles);
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setProjectTitle(nameWithoutExt || "Untitled Project");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024, // 25 MB
  });

  const handleCreateProject = async () => {
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }
    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image and enter a project title.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
      const response = await fetch("/api/imageKit/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await response.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Image upload failed");
      }
      const projectId = await createProject({
        title: projectTitle,
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width,
        height: uploadData.height,
        canvasState: null,
      });
      toast.success("Project created successfully!");
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onHandleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-2xl font-bold text-white"}>
              Create New Project
            </DialogTitle>
            {isFree && (
              <Badge
                variant={"secondary"}
                className={"bg-slate-700 text-white/70"}
              >
                {currentProjectCount}/3 projects created
              </Badge>
            )}
          </DialogHeader>
          <div className="space-y-4">
            {isFree && currentProjectCount >= 2 && (
              <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500">
                <CrownIcon className="h-5 w-5 text-amber-400" />
                <AlertDescription>
                  <div className="font-semibold text-amber-400 mb-2">
                    {currentProjectCount === 2
                      ? "Last free project available."
                      : "You have reached the limit of free projects. Upgrade to Pro for unlimited projects."}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Image Upload Area */}
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer ${isDragActive ? "border-cyan-400 bg-cyan-400/5" : "border-white/20 hover:border-white/40"} ${canCreate ? "" : "opacity-50 pointer-events-none"}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop your image here" : "Upload an Image"}
                </h3>
                <p>
                  {canCreate
                    ? "Drag and  drop your image , or click to browse "
                    : "Upgrade to Pro to create more project."}
                </p>{" "}
                <p className="text-sm  text-white/50">
                  Supports PNG , JPG , WEBP upto 25 MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-xl border w-full h-64 border-white/20 object-cover"
                    width={300}
                    height={200}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setProjectTitle("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-title" className="text-white">
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter project name..."
                    className="bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>

                {/* File Details */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ImagesIcon className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className={"gap-3"}>
            <Button
              variant={"ghost"}
              onClick={onHandleClose}
              disabled={isUploading}
              className={"text-white/70 hover:text-white"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!selectedFile || isUploading || !projectTitle.trim()}
              variant={"primary"}
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="animate-spin h-4 w-4" /> Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        restrictedTool="projects"
        reason="You need to upgrade to Pro to create more projects."
      />
    </>
  );
}

export default NewProjectModal;
